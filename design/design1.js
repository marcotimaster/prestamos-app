"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssdesign1 = void 0;
exports.cssdesign1 = `		*, ::after, ::before {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  text-align: var(--bs-body-text-align);
  background-color: #ffffff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
@media (min-width: 768px) {
.container, .container-md, .container-sm {
    max-width: 720px;
}
}
@media (min-width: 576px) {
.container, .container-sm {
    max-width: 540px;
}
}
@media (min-width: 992px) {
.container, .container-lg, .container-md, .container-sm {
    max-width: 960px;
}
}
@media (min-width: 768px) {
.container, .container-md, .container-sm {
    max-width: 720px;
}
}

.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * .5);
  padding-left: calc(var(--bs-gutter-x) * .5);
  margin-right: auto;
  margin-left: auto;
}
.container {
padding: 15px 0;
}
.justify-content-between {
  justify-content: space-between!important;
}
.flex-wrap {
  flex-wrap: wrap!important;
}
.w-100 {
  width: 100%!important;
}
.mw-100 {
max-width: 100%!important;
}
.d-flex {
  display: flex!important;
}
.mb-5 {
  margin-bottom: 3rem!important;
}
.align-items-center {
  align-items: center!important;
}
.flex-grow-1 {
  flex-grow: 1!important;
}
.flex-column {
  flex-direction: column!important;
}
.p-3 {
  padding: 1rem!important;
}
.border-0 {
  border: 0!important;
}
.card {
  --bs-card-spacer-y: 1rem;
  --bs-card-spacer-x: 1rem;
  --bs-card-title-spacer-y: 0.5rem;
  --bs-card-title-color: ;
  --bs-card-subtitle-color: ;
  --bs-card-border-width: var(--bs-border-width);
  --bs-card-border-color: var(--bs-border-color-translucent);
  --bs-card-border-radius: var(--bs-border-radius);
  --bs-card-box-shadow: ;
  --bs-card-inner-border-radius: calc(var(--bs-border-radius) - (var(--bs-border-width)));
  --bs-card-cap-padding-y: 0.5rem;
  --bs-card-cap-padding-x: 1rem;
  --bs-card-cap-bg: rgba(var(--bs-body-color-rgb), 0.03);
  --bs-card-cap-color: ;
  --bs-card-height: ;
  --bs-card-color: ;
  --bs-card-bg: var(--bs-body-bg);
  --bs-card-img-overlay-padding: 1rem;
  --bs-card-group-margin: 0.75rem;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: var(--bs-card-height);
  word-wrap: break-word;
  background-color: var(--bs-card-bg);
  background-clip: border-box;
  border: var(--bs-card-border-width) solid var(--bs-card-border-color);
  border-radius: var(--bs-card-border-radius);
}
.hr {
height: 1px; 
border: none; 
background-color: #000000; 
width: 304px; 
max-width: 100%;
margin: 8px 0;
}
.p {
margin-top:0cm;
margin-right:0cm;
margin-bottom:8.0pt;
margin-left:0cm;
line-height:107%;
font-size:15px;
text-align: justify;
font-family:"Calibri",sans-serif;
line-height: 1.3em;

}
.title {
margin-top:1em;
margin-right:0cm;
margin-bottom:5.0pt;
margin-left:0cm;
font-size:19px;
font-family:"Times New Roman",serif;
font-weight:bold;
text-align:center;
}
img {
border-top-width: 2px !important;
  border-right-width: 2px !important;
  border-bottom-width: 2px !important;
  border-left-width: 2px !important;
  border-top-style: dashed !important;
  border-right-style: dashed !important;
  border-bottom-style: dashed !important;
  border-left-style: dashed !important;
}
.blocked {
  background-color: rgba(224, 46, 254, 0.19);
  border-top-width: 2px !important;
  border-right-width: 2px !important;
  border-bottom-width: 2px !important;
  border-left-width: 2px !important;
  border-top-style: dashed !important;
  border-right-style: dashed !important;
  border-bottom-style: dashed !important;
  border-left-style: dashed !important;
  border-top-color: rgb(224, 46, 254) !important;
  border-right-color: rgb(224, 46, 254) !important;
  border-bottom-color: rgb(224, 46, 254) !important;
  border-left-color: rgb(224, 46, 254) !important;
  border-image-source: initial !important;
  border-image-slice: initial !important;
  border-image-width: initial !important;
  border-image-outset: initial !important;
  border-image-repeat: initial !important;
}`;
const design1 = `<div class="container">
<p class="title"><span>DOCUMENTO PRIVADO</span></p>
<p class="title">(CONTRATO DE PRESTAMO DE DINERO)</span></p>
<div class="card p-3 border-0">
<p class="p">Conste por el documento privado, el cual podr&aacute; ser elevado a categor&iacute;a de documento p&uacute;blico ante el s&oacute;lo reconocimiento de firmas y r&uacute;bricas.</p>
<p class="p">PRIMERA &ndash; (Prestamista) \${prestamista} mayor de edad h&aacute;bil por derecho, casado vecino de esta ciudad, declaro de libre voluntad realizar el pr&eacute;stamo de dinero.</p>
<p class="p">SEGUNDA &ndash; (Objeto) El pr&eacute;stamo lo realiz&oacute; al se&ntilde;or(a) \${deudor}, siendo el monto de \${cantidadSolicitada} soles.</p>
<p class="p">TERCERA &ndash; (Duraci&oacute;n) El tiempo de duraci&oacute;n del pr&eacute;stamo ser&aacute; de \${duracionPrestamo} a partir de la fecha de suscripci&oacute;n del presente documento.</p>
<p class="p">CUARTA &ndash; (Consentimiento) El prestamista y el prestatario declaran su conformidad con el monto se&ntilde;alado por plena conformidad, en caso de incumplimiento me har&eacute; pasible a sanciones de ley.</p>
<p class="p">QUINTA &ndash; (Aceptaci&oacute;n) Ambas partes se encuentran en plena aceptaci&oacute;n y conformidad con las clausulas anteriormente expuestas, sujet&aacute;ndose al escrito cumplimiento de las mismas. Es por eso que en se&ntilde;al de conformidad firmamos el pie del documento.</p>
<p>&nbsp;</p>
<p class="p">Es firmado en la fecha: \${fecha}.</p>
<p>&nbsp;</p>
<div class="d-flex justify-content-between flex-wrap w-100">
	<div class="d-flex flex-column align-items-center flex-grow-1 mb-5 mw-100" data-gjs-removable="false">
		<img width="100" height="100" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6IHJnYmEoMCwwLDAsMC4xNSk7IHRyYW5zZm9ybTogc2NhbGUoMC43NSkiPgogICAgICAgIDxwYXRoIGQ9Ik0yLjI4IDNMMSA0LjI3bDIgMlYxOWMwIDEuMS45IDIgMiAyaDEyLjczbDIgMkwyMSAyMS43MiAyLjI4IDNtMi41NSAwTDIxIDE5LjE3VjVhMiAyIDAgMCAwLTItMkg0LjgzTTguNSAxMy41bDIuNSAzIDEtMS4yNUwxNC43MyAxOEg1bDMuNS00LjV6Ij48L3BhdGg+CiAgICAgIDwvc3ZnPg==">
		<span class="hr"></span>
		<span>PRESTAMISTA</span>
	</div>
	<div class="d-flex flex-column align-items-center flex-grow-1 mb-5 mw-100" data-gjs-removable="false">
		<img width="100" height="100" class="blocked" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6IHJnYmEoMCwwLDAsMC4xNSk7IHRyYW5zZm9ybTogc2NhbGUoMC43NSkiPgogICAgICAgIDxwYXRoIGQ9Ik0yLjI4IDNMMSA0LjI3bDIgMlYxOWMwIDEuMS45IDIgMiAyaDEyLjczbDIgMkwyMSAyMS43MiAyLjI4IDNtMi41NSAwTDIxIDE5LjE3VjVhMiAyIDAgMCAwLTItMkg0LjgzTTguNSAxMy41bDIuNSAzIDEtMS4yNUwxNC43MyAxOEg1bDMuNS00LjV6Ij48L3BhdGg+CiAgICAgIDwvc3ZnPg==" alt="\${fotoFirmaDeudor}" data-gjs-editable="false">
		<span class="hr"></span>
		<span>PRESTATARIO</span>
	</div>
</div>
</div>
</div>`;
exports.default = design1;
//# sourceMappingURL=design1.js.map