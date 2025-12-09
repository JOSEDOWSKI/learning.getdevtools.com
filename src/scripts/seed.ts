import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { LessonProgress } from '../modules/lessons/entities/lesson-progress.entity';
import { CourseAccess } from '../modules/access/entities/course-access.entity';
import { Career } from '../modules/courses/entities/career.entity';
import { CareerCurriculum } from '../modules/courses/entities/career-curriculum.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'learning_platform',
  entities: [
    User,
    Course,
    Lesson,
    LessonProgress,
    CourseAccess,
    Career,
    CareerCurriculum,
  ],
  synchronize: false, // No sincronizar, solo insertar datos
  logging: true,
});

async function seed() {
  try {
    console.log('🌱 Iniciando seed de datos demo...');
    
    await AppDataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    const userRepository = AppDataSource.getRepository(User);
    const courseRepository = AppDataSource.getRepository(Course);
    const lessonRepository = AppDataSource.getRepository(Lesson);
    const lessonProgressRepository = AppDataSource.getRepository(LessonProgress);
    const courseAccessRepository = AppDataSource.getRepository(CourseAccess);
    const careerRepository = AppDataSource.getRepository(Career);
    const careerCurriculumRepository = AppDataSource.getRepository(CareerCurriculum);

    // Limpiar datos existentes (opcional - comentar si quieres mantener datos)
    console.log('🧹 Limpiando datos existentes...');
    await lessonProgressRepository.delete({});
    await courseAccessRepository.delete({});
    await lessonRepository.delete({});
    await careerCurriculumRepository.delete({});
    await courseRepository.delete({});
    await careerRepository.delete({});
    await userRepository.delete({});

    // 1. Crear usuarios
    console.log('👥 Creando usuarios...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const profesorPassword = await bcrypt.hash('profesor123', 10);
    const alumnoPassword = await bcrypt.hash('alumno123', 10);

    const admin = userRepository.create({
      dni: '12345678',
      full_name: 'Administrador Principal',
      email: 'admin@getdevtools.com',
      password: adminPassword,
      role: 'super_admin',
    });

    const profesor = userRepository.create({
      dni: '87654321',
      full_name: 'Profesor Ejemplo',
      email: 'profesor@getdevtools.com',
      password: profesorPassword,
      role: 'profesor',
    });

    const alumno = userRepository.create({
      dni: '11223344',
      full_name: 'Alumno Demo',
      email: 'alumno@getdevtools.com',
      password: alumnoPassword,
      role: 'alumno',
    });

    const savedUsers = await userRepository.save([admin, profesor, alumno]);
    const savedAdmin = savedUsers.find(u => u.role === 'super_admin')!;
    const savedProfesor = savedUsers.find(u => u.role === 'profesor')!;
    const savedAlumno = savedUsers.find(u => u.role === 'alumno')!;

    console.log('✅ Usuarios creados');

    // 2. Crear carrera
    console.log('🎓 Creando carrera...');
    const career = careerRepository.create({
      name: 'Desarrollo de Software',
      description: 'Carrera completa de desarrollo de software con las últimas tecnologías',
      total_months: 24,
      status: 'active',
    });
    const savedCareer = await careerRepository.save(career);
    console.log('✅ Carrera creada');

    // 3. Crear cursos
    console.log('📚 Creando cursos...');
    const curso1 = courseRepository.create({
      professor_id: savedProfesor.id,
      title: 'Introducción a TypeScript',
      base_price: 150.00,
      revenue_share_pct: 70,
      is_shared_access: false,
      credits: 4,
      description: 'Aprende los fundamentos de TypeScript desde cero',
      rubric: null,
    });

    const curso2 = courseRepository.create({
      professor_id: savedProfesor.id,
      title: 'NestJS Avanzado',
      base_price: 200.00,
      revenue_share_pct: 70,
      is_shared_access: false,
      credits: 6,
      description: 'Domina NestJS con patrones avanzados y mejores prácticas',
      rubric: null,
    });

    const savedCourses = await courseRepository.save([curso1, curso2]);
    console.log('✅ Cursos creados');

    // 4. Asociar cursos a la carrera
    console.log('🔗 Asociando cursos a la carrera...');
    const curriculum1 = careerCurriculumRepository.create({
      career_id: savedCareer.id,
      course_id: savedCourses[0].id,
      order_index: 1,
    });
    const curriculum2 = careerCurriculumRepository.create({
      career_id: savedCareer.id,
      course_id: savedCourses[1].id,
      order_index: 2,
    });
    await careerCurriculumRepository.save([curriculum1, curriculum2]);
    console.log('✅ Cursos asociados a la carrera');

    // 5. Crear lecciones para el primer curso
    console.log('📖 Creando lecciones...');
    const lecciones = [
      {
        course_id: savedCourses[0].id,
        title: 'Introducción a TypeScript',
        content: 'En esta lección aprenderás los conceptos básicos de TypeScript y cómo se diferencia de JavaScript.',
        order_index: 1,
        video_url: null,
        pdf_url: null,
        video_filename: null,
        pdf_filename: null,
      },
      {
        course_id: savedCourses[0].id,
        title: 'Tipos y Interfaces',
        content: 'Aprende a definir tipos e interfaces en TypeScript para crear código más robusto.',
        order_index: 2,
        video_url: null,
        pdf_url: null,
        video_filename: null,
        pdf_filename: null,
      },
      {
        course_id: savedCourses[0].id,
        title: 'Clases y Herencia',
        content: 'Domina la programación orientada a objetos en TypeScript con clases y herencia.',
        order_index: 3,
        video_url: null,
        pdf_url: null,
        video_filename: null,
        pdf_filename: null,
      },
    ];

    const savedLessons = await lessonRepository.save(
      lecciones.map(l => lessonRepository.create(l))
    );
    console.log('✅ Lecciones creadas');

    // 6. Crear acceso del alumno al primer curso
    console.log('🎫 Creando acceso del alumno...');
    const access = courseAccessRepository.create({
      student_id: savedAlumno.id,
      course_id: savedCourses[0].id,
      access_type: 'purchased',
      transaction_id: null,
      is_active: true,
    });
    await courseAccessRepository.save(access);
    console.log('✅ Acceso creado');

    // 7. Crear progreso de lecciones para el alumno
    console.log('📊 Creando progreso de lecciones...');
    const progress1 = lessonProgressRepository.create({
      student_id: savedAlumno.id,
      lesson_id: savedLessons[0].id,
      is_completed: true,
      progress_percentage: 100,
      video_time_watched: 0,
      notes: 'Excelente introducción, muy clara.',
    });

    const progress2 = lessonProgressRepository.create({
      student_id: savedAlumno.id,
      lesson_id: savedLessons[1].id,
      is_completed: false,
      progress_percentage: 50,
      video_time_watched: 0,
      notes: null,
    });

    await lessonProgressRepository.save([progress1, progress2]);
    console.log('✅ Progreso creado');

    console.log('');
    console.log('✨ Seed completado exitosamente!');
    console.log('');
    console.log('📋 Credenciales de acceso:');
    console.log('   👨‍💼 Admin:');
    console.log('      Email: admin@getdevtools.com');
    console.log('      Password: admin123');
    console.log('');
    console.log('   👨‍🏫 Profesor:');
    console.log('      Email: profesor@getdevtools.com');
    console.log('      Password: profesor123');
    console.log('');
    console.log('   👨‍🎓 Alumno:');
    console.log('      Email: alumno@getdevtools.com');
    console.log('      Password: alumno123');
    console.log('');
    console.log('🔗 Frontend local: http://localhost:3000');
    console.log('🔗 Backend local: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

seed();

