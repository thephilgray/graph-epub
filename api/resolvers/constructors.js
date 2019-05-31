const fetch = require('node-fetch');

const getQuizType = multipleAnswers =>
  multipleAnswers ? 'select-many' : 'select-one'; // may need to handle additional logic later
const db = 'http://localhost:5000';

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
      .catch(e => {
        throw new Error(e.message);
      });
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
      .catch(e => {
        throw new Error(e.message);
      });
    return new Lesson(lesson);
  }

  async exercises() {
    const exercises = await fetch(`${db}/exercises`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
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
      .catch(e => {
        throw new Error(e.message);
      });
    return sections
      .filter(({ id }) => this.sectionIds.includes(id))
      .map(section => new Section(section));
  }
}

module.exports = { Lesson, Section, Exercise };
