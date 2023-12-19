// ^ DTO Роли

class TokenDto {
  id: number;
  email: string;
  username: string;
  role: string;
  level: number;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.username = model.username;
    this.role = model.role;
    this.level = model.level;
  }
}

export default TokenDto;
