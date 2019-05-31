const fetch = require('node-fetch');
const { Lesson, Section, Exercise } = require('./constructors.js');
const db = 'http://localhost:5000';

module.exports = {
  lessons: async () =>
    fetch(`${db}/lessons`)
      .then(res => res.json())
      .then(lessons => lessons.map(lesson => new Lesson(lesson)))
      .catch(e => {
        throw new Error(e.message);
      }),
  sections: async () =>
    fetch(`${db}/sections`)
      .then(res => res.json())
      .then(sections => sections.map(section => new Section(section)))
      .catch(e => {
        throw new Error(e.message);
      }),
  exercises: async () =>
    fetch(`${db}/exercises`)
      .then(res => res.json())
      .then(exercises => exercises.map(exercise => new Exercise(exercise)))
      .catch(e => {
        throw new Error(e.message);
      }),

  lesson: (parent, { id }) =>
    fetch(`${db}/lessons/${id}`)
      .then(res => res.json())
      .then(lesson => new Lesson(lesson))
      .catch(e => {
        throw new Error(e.message);
      }),
  section: (parent, { id }) =>
    fetch(`${db}/sections/${id}`)
      .then(res => res.json())
      .then(section => new Section(section))
      .catch(e => {
        throw new Error(e.message);
      }),
  exercise: (parent, { id }) =>
    fetch(`${db}/exercises/${id}`)
      .then(res => res.json())
      .then(exercise => new Exercise(exercise))
      .catch(e => {
        throw new Error(e.message);
      })
};
