import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {StudentEntity} from "./student.entity";
import * as QRCode from 'qrcode'
import * as XLSX from 'xlsx';

import {CreateStudentDto} from "./student.dto";
import {sendParentsLoginEmail} from "../utils/send-parents-account-login-email";
import {ParentEntity} from "../parent/parent.entity";


@Injectable()
export class StudentService {
    constructor(@InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
                @InjectRepository(ParentEntity) private parentRepository: Repository<ParentEntity>) {
    }


    async createNewStudent(payload: CreateStudentDto) {
        const {fullName, parentEmail} = payload;

        const student = await this.studentRepository.create({"fullName": fullName});
        const parent = await this.parentRepository.findOne({where: {email: parentEmail}});
        if (parent) {
            student.parent = parent;
            await sendParentsLoginEmail(parent, fullName, true);
            await this.studentRepository.save(student);
            return student.toResponseObject();

        } else {
            const newParent = new ParentEntity();
            newParent.email = parentEmail;
            newParent.password = this.generateRandomPasswordForParent(10);
            newParent.children = [student];
            await sendParentsLoginEmail(newParent, fullName, false);
            await this.parentRepository.save(newParent);
        }
        return student.toResponseObject();
    }

    async createNewStudentsFromExcel(payloads: any[]) {
        const promises: any[] = [];
        for (const payload of payloads) {
            const workSheet = XLSX.read(payload.buffer);
            const studentList: CreateStudentDto[] = XLSX.utils.sheet_to_json(workSheet.Sheets[workSheet.SheetNames[0]])
            studentList.forEach(student => {
                return promises.push(this.createNewStudent(student));
            })
        }
        return (await Promise.all(promises));
    }

    async showAllStudents() {
        const students = await this.studentRepository.find({relations: ['groups', 'class', 'parent']});
        return students;
    }

    async showAllStudentsQrCode() {
        const students = await this.studentRepository.find();
        const promises: any[] = [];

        students.forEach(student => {
            promises.push(this.generateQrCode(student).then(res => {
                return {studentName: student.fullName, qrCode: res};
            }));
        });
        return (await Promise.all(promises));
    }

    async generateQrCode(student: StudentEntity) {
        try {
            return await QRCode.toDataURL(JSON.stringify({
                studentId: student.studentId,
                studentName: student.fullName
            }));
        } catch (err) {
            console.error(err)
        }
    }

    generateRandomPasswordForParent(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}