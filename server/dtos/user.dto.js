// ^ DTO - data trensfer object | `объект передачи данных`

// разреш.поля для FRONT
module.exports = class UserDto {
  email;
  id;
  // флаг актив.
  isActivated;
  // констр.с парам. модели откуда достаём поля
  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
};

// ! ошб. - Cannot read properties of undefined (reading 'email') | Class constructor UserDto cannot be invoked without 'new'
// module.exports = new UserDto();
