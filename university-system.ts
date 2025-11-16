// university-system.ts

// 1. ENUMs

// Статус студента в університеті.
enum StudentStatus {
    Active = "Active", // Активний студент
    Academic_Leave = "Academic_Leave", // В академічній відпустці
    Graduated = "Graduated", // Випускник
    Expelled = "Expelled" // Відрахований
}

// Тип курсу.
enum CourseType {
    Mandatory = "Mandatory", // Обов'язковий
    Optional = "Optional", // Вибірковий
    Special = "Special" // Спеціалізований
}

// Семестр навчання.
enum Semester {
    First = "First",
    Second = "Second"
}

// Оцінки з числовим значенням (від 2 до 5).
enum Grade {
    Excellent = 5, // Відмінно
    Good = 4, // Добре
    Satisfactory = 3, // Задовільно
    Unsatisfactory = 2 // Незадовільно
}

// Факультети університету.
enum Faculty {
    Computer_Science = "Computer_Science", // Комп'ютерні науки
    Economics = "Economics", // Економіка
    Law = "Law", // Право
    Engineering = "Engineering" // Інженерія
}

// 2. INTERFACES

// Опис об'єкта "Студент".
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

// Опис об'єкта "Курс".
interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
    // Додаткове поле для відстеження ID студентів, які зареєструвалися на курс
    enrolledStudentIds: number[]; 
}

// Опис об'єкта "Запис про оцінку". Використовуємо ім'я GradeRecord, щоб уникнути конфлікту імен з Enum Grade.
interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade; // Тут використовується Grade Enum
    date: Date;
    semester: Semester;
}

// 3. UNIVERSITY MANAGEMENT SYSTEM CLASS

// Система управління навчальним процесом університету. Містить методи для реєстрації студентів, курсів, виставлення оцінок та отримання статистики.
class UniversityManagementSystem {
    private nextStudentId: number = 1;
    private nextCourseId: number = 1;

    // Сховища даних
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeRecord[] = [];

    // Конструктор, що ініціалізує систему базовими даними (курсами).
    constructor() {
        this.initializeCourses();
    }

    // Ініціалізує систему кількома базовими курсами.
    private initializeCourses(): void {
        const initialCourses: Omit<Course, "id" | "enrolledStudentIds">[] = [
            { name: "Introduction to TS", type: CourseType.Mandatory, credits: 5, semester: Semester.First, faculty: Faculty.Computer_Science, maxStudents: 50 },
            { name: "Macroeconomics", type: CourseType.Mandatory, credits: 6, semester: Semester.First, faculty: Faculty.Economics, maxStudents: 60 },
            { name: "Civil Law", type: CourseType.Mandatory, credits: 5, semester: Semester.Second, faculty: Faculty.Law, maxStudents: 40 },
            { name: "Advanced Calculus", type: CourseType.Optional, credits: 4, semester: Semester.First, faculty: Faculty.Engineering, maxStudents: 30 }
        ];

        for (const courseData of initialCourses) {
            this.courses.push({
                ...courseData,
                id: this.nextCourseId++,
                enrolledStudentIds: [] // Початково ніхто не зареєстрований
            });
        }
    }
    
    // Методи управління студентами

    /**
     * Реєструє нового студента в системі.
     * @param studentData - Дані студента без ID.
     * @returns Створений об'єкт студента з присвоєним ID.
     */
    enrollStudent(studentData: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...studentData,
            id: this.nextStudentId++,
            status: StudentStatus.Active, // Новий студент завжди Active
        };
        this.students.push(newStudent);
        console.log(`Студента ${newStudent.fullName} (ID: ${newStudent.id}) успішно зараховано.`);
        return newStudent;
    }

    /**
     * Оновлює статус студента, перевіряючи валідність переходу.
     * @param studentId - ID студента.
     * @param newStatus - Новий статус.
     */
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            console.error(`Помилка: Студента з ID ${studentId} не знайдено.`);
            return;
        }

        const currentStatus = student.status;

        // Валідація: не можна перевести в статус Graduated, якщо студент Expelled
        if (currentStatus === StudentStatus.Expelled && newStatus === StudentStatus.Graduated) {
            console.error(`Валідація: Відрахованого студента не можна перевести у статус "Випускник".`);
            return;
        }
        // Валідація: не можна перевести з Graduated у Academic_Leave
        if (currentStatus === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
             console.error(`Валідація: Випускника не можна перевести у інший статус, окрім "Випускник".`);
            return;
        }

        student.status = newStatus;
        console.log(`Статус студента ${student.fullName} оновлено: ${currentStatus} -> ${newStatus}.`);
    }

    /**
     * Отримує список студентів за вказаним факультетом.
     * @param faculty - Факультет для фільтрації.
     * @returns Масив студентів.
     */
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }
    
    // Методи управління курсами та оцінками

    /**
     * Реєструє студента на курс, з перевіркою валідації.
     * @param studentId - ID студента.
     * @param courseId - ID курсу.
     */
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student) {
            console.error(`Помилка: Студента з ID ${studentId} не знайдено.`);
            return;
        }
        if (!course) {
            console.error(`Помилка: Курсу з ID ${courseId} не знайдено.`);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(`Валідація: Реєстрація на курс доступна лише для активних студентів.`);
            return;
        }
        if (course.faculty !== student.faculty) {
            console.error(`Валідація: Студент ${student.fullName} не може зареєструватися на курс ${course.name}, оскільки він не належить до його факультету (${course.faculty}).`);
            return;
        }
        if (course.enrolledStudentIds.length >= course.maxStudents) {
            console.error(`Валідація: Курс ${course.name} повністю заповнений (максимум: ${course.maxStudents}).`);
            return;
        }
        if (course.enrolledStudentIds.includes(studentId)) {
            console.error(`Валідація: Студент ${student.fullName} вже зареєстрований на курс ${course.name}.`);
            return;
        }

        // Успішна реєстрація
        course.enrolledStudentIds.push(studentId);
        console.log(`Студент ${student.fullName} успішно зареєстрований на курс ${course.name}.`);
    }

    /**
     * Встановлює оцінку студенту за курс, з перевіркою валідації.
     * @param studentId - ID студента.
     * @param courseId - ID курсу.
     * @param grade - Оцінка (використовується Enum Grade).
     */
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) {
            console.error(`Помилка: Студента або курсу не знайдено.`);
            return;
        }

        // Валідація: чи зареєстрований студент на курс?
        if (!course.enrolledStudentIds.includes(studentId)) {
            console.error(`Валідація: Студент ${student.fullName} не зареєстрований на курс ${course.name}. Оцінка не може бути виставлена.`);
            return;
        }
        
        // Перевірка, чи оцінка вже існує (для запобігання дублювання)
        const existingGradeIndex = this.grades.findIndex(g => g.studentId === studentId && g.courseId === courseId);

        const newGradeRecord: GradeRecord = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester, // Семестр беремо з курсу
        };

        if (existingGradeIndex > -1) {
            // Оновлюємо існуючу оцінку
            this.grades[existingGradeIndex] = newGradeRecord;
            console.log(`Оцінку студента ${student.fullName} за курс ${course.name} оновлено на ${Grade[grade]}.`);
        } else {
            // Додаємо нову оцінку
            this.grades.push(newGradeRecord);
            console.log(`Оцінка ${Grade[grade]} виставлена студенту ${student.fullName} за курс ${course.name}.`);
        }
    }

    /**
     * Отримує список усіх оцінок студента.
     * @param studentId - ID студента.
     * @returns Масив записів про оцінки.
     */
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    /**
     * Отримує список доступних курсів за факультетом і семестром.
     * @param faculty - Факультет.
     * @param semester - Семестр.
     * @returns Масив доступних курсів.
     */
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => 
            c.faculty === faculty && 
            c.semester === semester && 
            c.enrolledStudentIds.length < c.maxStudents
        );
    }

    /**
     * Розраховує середній бал (GPA) студента.
     * @param studentId - ID студента.
     * @returns Середній бал (число).
     */
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            return 0;
        }

        const totalPoints = studentGrades.reduce((sum, record) => sum + record.grade, 0);
        return totalPoints / studentGrades.length;
    }
    
    /**
     * Отримує список відмінників (GPA >= 4.5) за факультетом.
     * @param faculty - Факультет для фільтрації.
     * @returns Масив студентів-відмінників.
     */
    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        const topStudents: Student[] = [];

        for (const student of facultyStudents) {
            const avgGrade = this.calculateAverageGrade(student.id);
            // Вимога для відмінника: середній бал >= 4.5
            if (avgGrade >= 4.5) {
                topStudents.push(student);
            }
        }

        return topStudents;
    }
    
    // Допоміжний метод для отримання усіх курсів (для тестування).
    getAllCourses(): Course[] {
        return this.courses;
    }
}

// 4. ТЕСТУВАННЯ

const ums = new UniversityManagementSystem();
console.log("\n Ініціалізація та реєстрація");

// 1. Реєстрація студентів
const student1 = ums.enrollStudent({
    fullName: "Іван Коваленко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "PD-24"
});

const student2 = ums.enrollStudent({
    fullName: "Олена Мирна",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "PD-23"
});

const student3 = ums.enrollStudent({
    fullName: "Петро Залізний",
    faculty: Faculty.Economics,
    year: 3,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2022-09-01"),
    groupNumber: "PD-22"
});

// 2. Реєстрація на курси
const tsCourse = ums.getAllCourses().find(c => c.name === "Introduction to TS")!;
const econCourse = ums.getAllCourses().find(c => c.name === "Macroeconomics")!;

ums.registerForCourse(student1.id, tsCourse.id);
ums.registerForCourse(student2.id, tsCourse.id);
ums.registerForCourse(student3.id, econCourse.id);

// 3. Перевірка валідації реєстрації (Студент CS не може на курс Economics)
ums.registerForCourse(student1.id, econCourse.id); 

// 4. Виставлення оцінок
ums.setGrade(student1.id, tsCourse.id, Grade.Excellent); // 5
ums.setGrade(student2.id, tsCourse.id, Grade.Good); // 4

// 5. Оновлення статусу (Перевірка валідації)
ums.updateStudentStatus(student2.id, StudentStatus.Academic_Leave);
ums.registerForCourse(student2.id, tsCourse.id); // Спроба реєстрації студента в Academic_Leave
ums.updateStudentStatus(student2.id, StudentStatus.Active); 
ums.updateStudentStatus(student2.id, StudentStatus.Expelled); // Відрахування

console.log("\n Статистика та звіти");

// 6. Середній бал
console.log(`\nСередній бал Івана Коваленка: ${ums.calculateAverageGrade(student1.id).toFixed(2)}`); // Очікується 5.00
ums.setGrade(student1.id, econCourse.id, Grade.Excellent); // Спроба виставити оцінку за курс, на який не зареєстрований
ums.registerForCourse(student1.id, tsCourse.id); // Іван вже зареєстрований

// 7. Список відмінників (для CS)
ums.setGrade(student1.id, tsCourse.id, Grade.Excellent); // Повторне виставлення (оновлення)
const topCSStudents = ums.getTopStudentsByFaculty(Faculty.Computer_Science);
console.log(`\nВідмінники на факультеті ${Faculty.Computer_Science} (GPA >= 4.5):`);
if (topCSStudents.length > 0) {
    topCSStudents.forEach(s => console.log(`- ${s.fullName} (Середній бал: ${ums.calculateAverageGrade(s.id).toFixed(2)})`));
} else {
    console.log("- Відмінників не знайдено.");
}