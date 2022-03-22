export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string = '1';

  employeeCode: string;
  userType: string;
  organizationId: number;
  departmentId: number;
  designationCodeId: number;
  gradeCodeId: number;
  disciplineCodeId: number;
  locationId: number;
  gender: string;
  userId: string;
  joiningDate: Date;
  leavingDate: Date;
  startDate: Date;
  uploadImage: BinaryType;
  userLicense: boolean;
}
