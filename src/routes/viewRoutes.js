import { Router } from 'express';

const router = Router();

router.get('/realtimeproducts', (req, res) => {
  const opts = {
    title: 'Real time products socket.io',
  };
  res.render('realTimeProducts', opts);
});

export default router;
