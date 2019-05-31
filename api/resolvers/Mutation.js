const uniqid = require('uniqid');
const isEmpty = require('lodash/isEmpty');
const fetch = require('node-fetch');
const { Lesson, Section, Exercise } = require('./constructors.js');
const db = 'http://localhost:5000';

module.exports = {
  addLesson: async (parent, { input }) => {
    const newLesson = {
      id: uniqid(),
      sections: [],
      ...input
    };
    const lesson = await fetch(`${db}/lessons`, {
      method: 'post',
      body: JSON.stringify(newLesson),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return new Lesson(lesson);
  },
  addSection: async (parent, { lessonId, input }) => {
    const newSection = {
      id: uniqid(),
      lesson: lessonId,
      exercises: [],
      ...input
    };
    console.log(newSection);

    const parentLesson = await fetch(`${db}/lessons/${lessonId}`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    if (isEmpty(parentLesson))
      throw new Error(`lesson ${lessonId} does not exist`);

    const section = await fetch(`${db}/sections`, {
      method: 'post',
      body: JSON.stringify(newSection),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    const { sections } = await fetch(`${db}/lessons/${lessonId}`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    sections.push(section.id);

    await fetch(`${db}/lessons/${lessonId}`, {
      method: 'patch',
      body: JSON.stringify({ sections }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    return new Section(section);
  },
  addExercise: async (parent, { sectionId, input }) => {
    const newExercise = {
      id: uniqid(),
      section: sectionId,
      ...input
    };

    const parentSection = await fetch(`${db}/sections/${sectionId}`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    if (isEmpty(parentSection))
      throw new Error(`lesson ${sectionId} does not exist`);

    // add the lesson id to the new exercise
    newExercise.lesson = parentSection.lesson;

    const exercise = await fetch(`${db}/exercises`, {
      method: 'post',
      body: JSON.stringify(newExercise),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    const { exercises } = await fetch(`${db}/sections/${sectionId}`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    exercises.push(exercise.id);

    await fetch(`${db}/sections/${sectionId}`, {
      method: 'patch',
      body: JSON.stringify({ exercises }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    return new Exercise(exercise);
  },
  removeExercise: async (parent, { id }) => {
    // do everything backwards
    const sections = await fetch(`${db}/sections`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    const filteredSections = sections.filter(({ exercises }) =>
      exercises.includes(id)
    );

    await filteredSections.forEach(async section => {
      await fetch(`${db}/sections/${section.id}`, {
        method: 'patch',
        body: JSON.stringify({
          exercises: [...section.exercises.filter(exercise => exercise !== id)]
        }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .catch(e => {
          throw new Error(e.message);
        });
    });

    // then remove exercise
    await fetch(`${db}/exercises/${id}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    return id;
  },
  removeSection: async (parent, { id }) => {
    // remove any exercises associated with that section

    const exercisesToRemove = await fetch(`${db}/exercises?section=${id}`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    await exercisesToRemove.forEach(async exercise => {
      await fetch(`${db}/exercises/${exercise.id}`, {
        method: 'delete'
      })
        .then(res => res.json())
        .catch(e => Error(e));
    });

    // fetch all lessons
    const lessons = await fetch(`${db}/lessons`)
      .then(res => res.json())
      .catch(e => Error(e));
    // remove the section id from all lesson.sections for all lessons
    const [lessonToUpdate] = lessons.filter(lesson =>
      lesson.sections.includes(id)
    );

    await fetch(`${db}/lessons/${lessonToUpdate.id}`, {
      method: 'patch',
      body: JSON.stringify({
        sections: lessonToUpdate.sections.filter(section => section !== id)
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    // finally, remove section
    await fetch(`${db}/sections/${id}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return id;
  },
  removeLesson: async (parent, { id }) => {
    // fetch all the sections from that lesson
    const allSections = await fetch(`${db}/sections`)
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

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
        .catch(e => {
          throw new Error(e.message);
        });
    });

    // remove the sections
    await allSections
      .filter(({ lesson }) => lesson === id)
      .forEach(async ({ id: sectionId }) => {
        await fetch(`${db}/sections/${sectionId}`, { method: 'delete' })
          .then(res => res.json())
          .catch(e => {
            throw new Error(e.message);
          });
      });

    await fetch(`${db}/lessons/${id}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });

    return id;
  },
  updateLesson: async (parent, { id, input }) => {
    const lesson = await fetch(`${db}/lessons/${id}`, {
      method: 'patch',
      body: JSON.stringify({
        ...input
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return new Lesson(lesson);
  },
  updateSection: async (parent, { id, input }) => {
    const section = await fetch(`${db}/sections/${id}`, {
      method: 'patch',
      body: JSON.stringify({
        ...input
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return new Section(section);
  },
  updateExercise: async (parent, { id, input }) => {
    const exercise = await fetch(`${db}/exercise/${id}`, {
      method: 'patch',
      body: JSON.stringify({
        ...input
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .catch(e => {
        throw new Error(e.message);
      });
    return new Exercise(exercise);
  }
};
