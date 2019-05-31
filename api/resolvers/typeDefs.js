const typeDefs = `

input LessonInput{
    title: String
    name: String
    img: String
    objectives: [String]
}
input SectionInput{
    type: String
    name: String
    title: String
    audio: String
}
input ExerciseInput{
    type: String
    name: String
    answer: String
    instructions: String
    prompt: String
    inputs: [String]
    quizType: String
}
type Lesson {
    id: String!
    name: String
    title: String
    img: String
    objectives: [String]
    sections: [Section]
}

type Section {
    id: String!
    name: String
    type: String
    lesson: Lesson!
    title: String
    audio: String
    exercises: [Exercise]
}
type Exercise {
    id: String!
    name: String
    sectionId: String!
    lessonId: String!
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
    lesson(id: String!): Lesson!
    section(id: String!): Section!
    exercise(id: String!): Exercise!
}

type Mutation{
    addLesson(input: LessonInput): Lesson
    addSection(lessonId: String!, input: SectionInput): Section
    addExercise(sectionId: String!, input: ExerciseInput): Exercise
    removeExercise(id: String!): String
    removeSection(id: String!): String
    removeLesson(id:String!): String
    updateLesson(id:String!, input: LessonInput): Lesson
    updateSection(id:String!, input: SectionInput): Section
    updateExercise(id:String!, input: ExerciseInput): Exercise
}
`;

module.exports = typeDefs;
