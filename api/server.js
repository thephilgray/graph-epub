const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
const jsonServer = require('json-server');
const uniqid = require('uniqid');
const isEmpty = require('lodash/isEmpty');

const dbServer = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();
const dbPort = '5000';
const db = `http://localhost:${dbPort}`;

dbServer.use(middlewares);
dbServer.use(router);
dbServer.listen(dbPort, () => {
  console.log(`JSON Server is running at ${db}.`);
});

const getQuizType = multipleAnswers =>
  multipleAnswers ? 'select-many' : 'select-one'; // may need to handle additional logic later

class Exercise {
  constructor({
    id,
    name,
    section,
    type,
    answer,
    instructions,
    prompt,
    inputs
  }) {
    this.id = id;
    this.sectionId = section;
    this.name = name;
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
  constructor({ id, name, lesson, title, type, audio, exercises }) {
    this.id = id;
    this.lessonId = lesson;
    this.exerciseIds = exercises;
    this.name = name;
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
  constructor({ id, name, sections, objectives, title, img }) {
    this.id = id;
    this.name = name;
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

input LessonInput{
    title: String
    img: String
    objectives: [String]
}
input SectionInput{
    type: String
    title: String
    audio: String
}
input ExerciseInput{
    type: String
    answer: String
    instructions: String
    prompt: String
    inputs: [String]
    quizType: String
}
type Lesson {
    id: String!
    title: String
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
    addLesson(name: String, title: String, img: String, objectives: [String] ): Lesson
    addSection(name: String, lessonId: String!, title: String, audio: String, type: String): Section
    addExercise(name: String, sectionId: String!, type: String!, answer: String!, inputs: [String]!, instructions: String, prompt: String): Exercise
    removeExercise(id: String!): Exercise
    removeSection(id: String!): Section
    removeLesson(id:String!): Lesson
    updateLesson(id:String!, input: LessonInput): Lesson
    updateSection(id:String!, input: SectionInput): Section
    updateExercise(id:String!, input: ExerciseInput): Exercise
}
`;

const resolvers = {
  Mutation: {
    addLesson: async (parent, { name, title, img, objectives }) => {
      const newLesson = {
        id: uniqid(),
        name,
        title,
        img,
        objectives,
        sections: []
      };
      fetch(`${db}/lessons`, {
        method: 'post',
        body: JSON.stringify(newLesson),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    addSection: async (parent, { name, lessonId, title, audio, type }) => {
      const newSection = {
        id: uniqid(),
        name,
        type,
        lesson: lessonId,
        title,
        audio,
        exercises: []
      };

      const parentLesson = await fetch(`${db}/lessons/${lessonId}`)
        .then(res => res.json())
        .catch(e => console.error(e));

      if (isEmpty(parentLesson))
        throw new Error(`lesson ${lessonId} does not exist`);

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
      { name, sectionId, type, answer, inputs, instructions, prompt }
    ) => {
      const newExercise = {
        id: uniqid(),
        name,
        section: sectionId,
        type,
        answer,
        inputs,
        instructions,
        prompt
      };

      const parentSection = await fetch(`${db}/sections/${sectionId}`)
        .then(res => res.json())
        .catch(e => console.error(e));

      if (isEmpty(parentSection))
        throw new Error(`lesson ${sectionId} does not exist`);

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
    },
    removeExercise: async (parent, { id }) => {
      // do everything backwards
      const sections = await fetch(`${db}/sections`)
        .then(res => res.json())
        .catch(e => console.error(e));

      const filteredSections = sections.filter(({ exercises }) =>
        exercises.includes(id)
      );

      await filteredSections.forEach(async section => {
        await fetch(`${db}/sections/${section.id}`, {
          method: 'patch',
          body: JSON.stringify({
            exercises: [
              ...section.exercises.filter(exercise => exercise !== id)
            ]
          }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .catch(e => console.error(e));
      });

      // then remove exercise
      await fetch(`${db}/exercises/${id}`, {
        method: 'delete'
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    removeSection: async (parent, { id }) => {
      // remove any exercises associated with that section

      const exercisesToRemove = await fetch(`${db}/exercises?section=${id}`)
        .then(res => res.json())
        .catch(e => console.error(e));

      await exercisesToRemove.forEach(async exercise => {
        await fetch(`${db}/exercises/${exercise.id}`, {
          method: 'delete'
        })
          .then(res => res.json())
          .catch(e => console.error(e));
      });

      // fetch all lessons
      const lessons = await fetch(`${db}/lessons`)
        .then(res => res.json())
        .catch(e => console.error(e));
      // remove the section id from all lesson.sections for all lessons
      const lessonsToUpdate = lessons.filter(lesson =>
        lesson.sections.includes(Number(id))
      );
      console.log(lessonsToUpdate);

      // update lessons
      await lessonsToUpdate.forEach(async lesson => {
        await fetch(`${db}/lessons/${lesson.id}`, {
          method: 'patch',
          body: JSON.stringify({
            sections: lesson.sections.filter(section => section !== id)
          }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .catch(e => console.error(e));
      });

      // finally, remove section
      await fetch(`${db}/sections/${id}`, {
        method: 'delete'
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    removeLesson: async (parent, { id }) => {
      // fetch all the sections from that lesson
      const allSections = await fetch(`${db}/sections`)
        .then(res => res.json())
        .catch(e => console.error(e));

      const allExercisesInSections = allSections.reduce((acc, curr) => {
        if (curr.lesson === id) {
          acc.push(...curr.exercises);
        }
        return acc;
      }, []);

      // filter out all the exercises from those sections
      await allExercisesInSections.forEach(async exercise => {
        await fetch(`${db}/exercises/${exercise}`, { method: 'delete' })
          .then(res => res.json())
          .catch(e => console.error(e));
      });

      // remove the sections
      await allSections
        .filter(({ lesson }) => lesson === id)
        .forEach(async ({ id: sectionId }) => {
          await fetch(`${db}/sections/${sectionId}`, { method: 'delete' })
            .then(res => res.json())
            .catch(e => console.error(e));
        });

      await fetch(`${db}/lessons/${id}`, {
        method: 'delete'
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    updateLesson: async (parent, { id, input }) => {
      await fetch(`${db}/lessons/${id}`, {
        method: 'patch',
        body: JSON.stringify({
          ...input
        }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    updateSection: async (parent, { id, input }) => {
      await fetch(`${db}/sections/${id}`, {
        method: 'patch',
        body: JSON.stringify({
          ...input
        }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => console.error(e));
    },
    updateExercise: async (parent, { id, input }) => {
      await fetch(`${db}/exercise/${id}`, {
        method: 'patch',
        body: JSON.stringify({
          ...input
        }),
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
        .then(lessons =>
          lessons.length > 0 ? lessons.map(lesson => new Lesson(lesson)) : []
        ),
    sections: () =>
      fetch(`${db}/sections`)
        .then(res => res.json())
        .then(sections =>
          sections.length > 0
            ? sections.map(section => new Section(section))
            : []
        ),
    exercises: () =>
      fetch(`${db}/exercises`)
        .then(res => res.json())
        .then(exercises =>
          exercises.length > 0
            ? exercises.map(exercise => new Exercise(exercise))
            : []
        ),

    lesson: (parent, { id }) =>
      fetch(`${db}/lessons/${id}`).then(res => res.json()),
    section: (parent, { id }) =>
      fetch(`${db}/sections/${id}`).then(res => res.json()),
    exercise: (parent, { id }) =>
      fetch(`${db}/exercises/${id}`).then(res => res.json())
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log(`server is running on http://localhost:4000`));
