const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const logindb = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // MySQL 사용자 이름
  password: '0818',      // MySQL 비밀번호
  database: 'tooldb'
});

// MySQL 데이터베이스에 연결
logindb.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ', err);
    return;
  }
  console.log('tooldb에 성공적으로 연결되었습니다.');
});

module.exports = logindb;
