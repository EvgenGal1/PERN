// ^ DTO - data trensfer object | `объект передачи данных` | выборка полей

// разреш.поля для FRONT
class UserDto {
  id: number;
  username?: string;
  email: string;
  role: string;
  // isActivated: boolean;

  // констр.с парам. модели откуда достаём поля
  constructor(model: {
    id: number;
    email: string;
    role: string;
    username?: string;
  }) {
    this.id = model.id;
    this.username = model.username;
    this.email = model.email;
    this.role = model.role;
    // this.isActivated = model.isActivated;
  }
}

export default UserDto;
