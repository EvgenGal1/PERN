// ^ DTO - data trensfer object | `объект передачи данных`

// разреш.поля для FRONT
/* module.exports = */ class UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  // isActivated: boolean;

  // констр.с парам. модели откуда достаём поля
  constructor(model) {
    this.id = model.id;
    this.username = model.username;
    this.email = model.email;
    this.role = model.role;
    // this.isActivated = model.isActivated;
  }
}

// export default new UserDto();
// module.exports = new UserDto();
export default UserDto;
