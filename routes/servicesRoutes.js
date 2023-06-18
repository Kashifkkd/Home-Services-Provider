const Router = require('express');
const router = Router();
const servicesControllers = require('../controllers/servicesControllers');


router.get('/services', servicesControllers.servicesDashboard);
router.get('/:username/:city/:area/:service/shop-list/', servicesControllers.shopList_get);
// router.post('/:username/:city/:area/:service/shop-list/', servicesControllers.shopList_post);
router.get('/:username/:shopname/:service/:id/:price/details/', servicesControllers.serviceDetails);
// router.post('/:username/:shopname/:service/:id/details/', servicesControllers.serviceDetails);
router.get('/:username/:shopname/:service/:id/:price/proceed-page', servicesControllers.proceedPage);
router.post('/:username/:shopname/:service/:id/:price/proceed-page', servicesControllers.proceedPage_post);

module.exports = router;