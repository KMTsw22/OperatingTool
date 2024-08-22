const express = require('express');
const cors = require('cors');
//const { redisClient, saveDataFromDBToRedis } = require('./config/redis'); // Redis 클라이언트와 함수 가져오기


const app = express();
const port = 3001;

// JSON 본문을 파싱할 수 있도록 설정
app.use(express.json());
app.use(cors());

// 사용자 라우트 설정
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// 게임 라우트 설정
const gameRoutes = require('./routes/gameRoutes');
app.use('/game', gameRoutes);

// 기본 루트
app.get('/', (req, res) => {
  res.send('Hello World!');
});
/*
app.get('/getredis',(req, res) => {
  res.send(redisClient);
})
*/
// 서버 시작
app.listen(port, async() => {
  //await saveDataFromDBToRedis();
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

// 애플리케이션 종료 시 Redis 클라이언트 종료
/*
process.on('SIGINT', () => {
  redisClient.quit((err) => {
    if (err) {
      console.error('Redis 클라이언트 종료 오류:', err);
    } else {
      console.log('Redis 클라이언트 종료 완료');
    }
    process.exit();
  });
});*/
