export interface IUsers {
  selected?: boolean;
  id: number;
  userName: string;  
  employeeCode: string;
  userType: string;
  organizationId: number;
  departmentId: number;
  designationCodeId: number;
  gradeCodeId: number;
  disciplineCodeId: number;
  locationId: number;
  roleCodeId: number;
  gender: string;
  emailId: string;
  userId: string;
  password: string;
  joiningDate: Date;
  leavingDate: Date;
  startDate: Date;
  uploadImage: BinaryType;
  userLicense: boolean;
}

export class Users {
  selected?: boolean;
  id: number;
  userName: string;
  employeeCode: string;
  userType: string;
  organizationId: number;
  departmentId: number;
  designationCodeId: number;
  gradeCodeId: number;
  disciplineCodeId: number;
  locationId: number;
  roleCodeId: number;
  gender: string;
  emailId: string;
  userId: string;
  password: string;
  joiningDate: Date;
  leavingDate: Date;
  startDate: Date;
  uploadImage: BinaryType;
  userLicense: boolean;
}
