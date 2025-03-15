import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './typeORMconfig';
import { Student } from './entity/Students';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/students/:studentId?', async (req, res): Promise<void> => {
  const studentRepository = AppDataSource.getRepository(Student);
  const { studentId } = req.params;

  try {
    if (studentId) {
      const id = parseInt(studentId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid student ID' });
        return;
      }

      const student = await studentRepository.findOneBy({ studentId: id });
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      res.json(student);
    } else {
      const students = await studentRepository.find();
      res.json(students);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

app.post('/students', async (req, res): Promise<void> => {
  const studentRepository = AppDataSource.getRepository(Student);
  const { firstName, lastName, age } = req.body;

  try {
    const newStudent = studentRepository.create({ firstName, lastName, age });
    await studentRepository.save(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
});


app.put('/students/:studentId', async (req, res): Promise<void> => {
  const studentRepository = AppDataSource.getRepository(Student);
  const { studentId } = req.params;
  const { firstName, lastName, age } = req.body;

  try {
    const id = parseInt(studentId, 10); // Convert string to number
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid student ID' });
      return;
    }

    const student = await studentRepository.findOneBy({ studentId: id });
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    student.firstName = firstName;
    student.lastName = lastName;
    student.age = age;

    await studentRepository.save(student);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});

app.delete('/students/:studentId', async (req, res): Promise<void> => {
  const studentRepository = AppDataSource.getRepository(Student);
  const { studentId } = req.params;

  try {
    const id = parseInt(studentId, 10); // Convert string to number
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid student ID' });
      return;
    }

    const student = await studentRepository.findOneBy({ studentId: id });
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    await studentRepository.remove(student);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
});



AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));