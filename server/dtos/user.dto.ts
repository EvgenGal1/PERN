// ^ DTO - data trensfer object | `объект передачи данных`

// разреш.поля для FRONT
module.exports = class UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  isActivated: boolean;
  // констр.с парам. модели откуда достаём поля
  constructor(model) {
    this.id = model.id;
    this.username = model.username;
    this.email = model.email;
    this.role = model.role;
    this.isActivated = model.isActivated;
  }
};

// ! ошб. - Cannot read properties of undefined (reading 'email') | Class constructor UserDto cannot be invoked without 'new'
// module.exports = new UserDto();
