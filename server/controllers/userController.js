//안씀아직

const logindb = require('../config/loginDB');
// 사용자 목록 조회
exports.getUsers = (req, res) => {
  const query = 'SELECT * FROM user';
  logindb.query(query, (err, results) => {
    if (err) {
      console.error('쿼리 실행 오류: ', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  });
};

// 사용자 추가
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO user (userid, userpw) VALUES (?, ?)';
  logindb.query(query, [name, email], (err, result) => {
    if (err) {
      console.error('쿼리 실행 오류: ', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.status(201).send('사용자 추가됨');
  });
};
