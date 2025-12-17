const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('yojana', 10);
console.log(hash);
