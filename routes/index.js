var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;


/* GET home page. */
router.get('/', async function(req, res, next) {

  var novedades = await novedadesModel.getNovedades(); //falta ;

  novedades = novedades.splice(0, 5); // seleccionamos los primeros 5 elementos del array
  //se puede limitar de la query tambien
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/noimage.jpg'
      }
    }
  });


  res.render('index', {
    novedades
  });
});



router.post('/', async(req, res, next) => {

  var nombre = req.body.nombre;
  var email = req.body.email;
  var tel = req.body.tel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'gastonperalta93@gmail.com',
    subject: 'CONTACTO CERVECERIA',
    html: nombre + " se contacto a traves de la web y quiere mas informacion a este correo : " 
    + email + ". <br> Ademas, hizo este comentario: " + mensaje +
    ". <br> su tel es: " + tel
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente'
  });
});

module.exports = router;

