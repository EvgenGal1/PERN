// ^ DTO Токена

class TokenDto {
  id: number;
  email: string;
  username: string;
  role: string;
  level: number;

  constructor(model: {
    id: number;
    email: string;
    username: string;
    role: string;
    level: any;
  }) {
    this.id = model.id;
    this.email = model.email;
    this.username = model.username;
    this.role = model.role;
    this.level = model.level;
  }
}

export default TokenDto;
