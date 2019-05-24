const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
const jsonServer = require('json-server');

const dbServer = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const dbPort = '3000';
const db = `http://localhost:${dbPort}`;

dbServer.use(middlewares);
dbServer.use(router);
dbServer.listen(dbPort, () => {
  console.log(`JSON Server is running at ${db}.`);
});

const getQuizType = multipleAnswers =>
  multipleAnswers ? 'select-many' : 'select-one'; // may need to handle additional logic later

class Exercise {
  constructor({ id, section, type, answer, instructions, prompt, inputs }) {
    this.sectionId = section;
    this.id = id;
    this.type = type;
    this.answer = answer;
    this.instructions = instructions;
    this.prompt = prompt;
    this.inputs = inputs;
    this.quizType = getQuizType(answer.split(',').length > 1);
  }

  async section() {
    const section = await fetch(`${db}/sections/${this.sectionId}`)
      .then(res => res.json())
      .catch(e => console.error(e));
    return new Section(section);
  }
}

class Section {
  constructor({ id, lesson, title, type, audio, exercises }) {
    this.lessonId = lesson;
    this.exerciseIds = exercises;
    this.id = id;
    this.title = title;
    this.type = type;
    this.audio = audio;
  }

  async lesson() {
    const lesson = await fetch(`${db}/lessons/${this.lessonId}`)
      .then(res => res.json())
      .catch(e => console.error(e));
    return new Lesson(lesson);
  }

  async exercises() {
    const exercises = await fetch(`${db}/exercises`)
      .then(res => res.json())
      .catch(e => console.error(e));
    return exercises
      .filter(({ id }) => this.exerciseIds.includes(id))
      .map(exercise => new Exercise(exercise));
  }
}

class Lesson {
  constructor({ sections, objectives, id, title, img }) {
    this.id = id;
    this.title = title;
    this.sectionIds = sections;
    this.objectives = objectives;
    this.img = img;
  }

  async sections() {
    const sections = await fetch(`${db}/sections`)
      .then(res => res.json())
      .catch(e => console.error(e));
    return sections
      .filter(({ id }) => this.sectionIds.includes(id))
      .map(section => new Section(section));
  }
}

const typeDefs = `
type Lesson {
    id: String!
    title: String!
    img: String
    objectives: [String]
    sections: [Section]
}

type Section {
    id: String!
    type: String
    lesson: String!
    title: String!
    audio: String
    exercises: [Exercise]
}
type Exercise {
    id: String!
    section: String!
    type: String!
    answer: String!
    instructions: String
    prompt: String
    inputs: [String]
    quizType: String
}

type Query{
    lessons: [Lesson]!
    sections: [Section]!
    exercises: [Exercise]!
    lesson(id: String!): Lesson
    section(id: String!): Section
    exercise(id: String!): Exercise
}

type Mutation{
    addLesson(id: String!, title: String, img: String, objectives: [String] ): Lesson
    addSection(id: String!, lessonId: String!, title: String, audio: String, type: String): Section
    addExercise(id: String!, sectionId: String!, type: String!, answer: String!, inputs: [String]!, instructions: String, prompt: String): Exercise
}
`;

const resolvers = {
  Mutation: {
    addLesson: async (parent, { id, title, img, objectives }) => {
      const newLesson = { id, title, img, objectives, sections: [] };
      fetch(`${db}/lessons`, {
        method: 'post',
        body: JSON.stringify(newLesson),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    addSection: async (parent, { id, lessonId, title, audio, type }) => {
      const newSection = {
        id,
        type,
        lesson: lessonId,
        title,
        audio,
        exercises: []
      };
      const { id: sectionId } = await fetch(`${db}/sections`, {
        method: 'post',
        body: JSON.stringify(newSection),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));

      const { sections } = await fetch(`${db}/lessons/${lessonId}`)
        .then(res => res.json())
        .catch(e => console.error(e));

      sections.push(sectionId);

      await fetch(`${db}/lessons/${lessonId}`, {
        method: 'patch',
        body: JSON.stringify({ sections }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(json => console.log(json));
    },
    addExercise: async (
      parent,
      { id, sectionId, type, answer, inputs, instructions, prompt }
    ) => {
      const newExercise = {
        id,
        section: sectionId,
        type,
        answer,
        inputs,
        instructions,
        prompt
      };
      const { id: exerciseId } = await fetch(`${db}/exercises`, {
        method: 'post',
        body: JSON.stringify(newExercise),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));

      const { exercises } = await fetch(`${db}/sections/${sectionId}`)
        .then(res => res.json())
        .catch(e => console.error(e));

      exercises.push(exerciseId);

      await fetch(`${db}/sections/${sectionId}`, {
        method: 'patch',
        body: JSON.stringify({ exercises }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    }
  },
  Query: {
    lessons: () =>
      fetch(`${db}/lessons`)
        .then(res => res.json())
        .then(lessons => lessons.map(lesson => new Lesson(lesson))),
    sections: () =>
      fetch(`${db}/sections`)
        .then(res => res.json())
        .then(sections => sections.map(section => new Section(section))),
    exercises: () =>
      fetch(`${db}/exercises`)
        .then(res => res.json())
        .then(exercises => exercises.map(exercise => new Exercise(exercise))),

    lesson: id => fetch(`${db}/lessons/${id}`).then(res => res.json()),
    section: id => fetch(`${db}/sections/${id}`).then(res => res.json()),
    exercise: id => fetch(`${db}/exercises/${id}`).then(res => res.json())
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log(`server is running on http://localhost:4000`));
