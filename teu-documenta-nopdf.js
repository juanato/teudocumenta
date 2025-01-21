/* TEU-DOCUMENTA.JS
 * Tablón Edictal Único ESPAÑA
 * Gestor Documental
 * Descarga ficheros PDF que contengan los tópicos de búsqueda
 * Genera una CARPETA con los datos de la búsqueda
 * fichero TOPICOS.TXT
 * 
 * En la misma carpeta se descargan los PDF, se genera un HTML con enlace a ellos y a GOOGLE DOCS
 * 
 * 

http://example.org/doc.pdf#Chapter6
http://example.org/doc.pdf#page=3
http://example.org/doc.pdf#page=3&zoom=200,250,100
http://example.org/doc.pdf#zoom=50
http://example.org/doc.pdf#page=72&view=fitH,100
http://example.org/doc.pdf#pagemode=none
http://example.org/doc.pdf#pagemode=bookmarks&page=2
http://example.org/doc.pdf#page=3&pagemode=thumbs
http://example.org/doc.pdf#collab=DAVFDF@http://review_server/Collab/user1
http://example.org/doc.pdf#page=1&comment=452fde0e-fd22-457c-84aa-2cf5bed5a349
http://example.org/doc.pdf#fdf=http://example.org/doc.fd


 * 2015 juanato@gmail.com
 * Versión JUNIO 2015
*/

//iframe src="http://docs.google.com/viewer?url=http%3A%2F%2Fwww.yoursite.com%2Fpdf%2Ftest.pdf&embedded=true" width="600" height="780" style="border: none;"></iframe>
//http://docs.google.com/gview?url=http://mesdomaines.nu/eendracht/include_pdf/pdf1.pdf&amp;embedded=true
//http://view.officeapps.live.com/op/view.aspx?src=http://ankurm.com/pages/word.doc

 
Components.utils.import("resource://imacros/utils.js");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");



Components.utils.import("resource://gre/modules/Downloads.jsm");
Components.utils.import("resource://gre/modules/osfile.jsm")
Components.utils.import("resource://gre/modules/Task.jsm");


const CRLF = "\r\n";
const LF = "\n";
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils; 

const cVersion = "TEU DOCUMENTA 2.0";
const cFicErr = "error-teu.txt";  
const cFicPar = "boletines.txt";
const cFicMd  = "topicos.txt";

const document = window.content.document;   // Passtrough DOM Mozilla <==> iMacros framework

// SET !POPUP_ALLOWED 1.1.1.1
//var dir = FileUtils.getDir("ProfD", ["DIR"], true);
//var cFile = imns.FIO.openNode("/home/juanato/nada.txt");
//URL GOTO=imacros://run/?m=data_check.js
// Usar  getUser()      
//document.FRAME NAME="win_data"
//TAG POS=1 TYPE=H1 ATTR=CLASS:h1Icons
//var myObj = JSON.parse( iimGetLastExtract(1) );

var cDevuelve, cDame;  
var aBoletines ;
var nItem = 0; // Contador de Linea



var nElegido = 0; // Elección, índice a la tabla del elemento elegido
var aFAT = []; // Simulación de estructura File Allocation table
var aPerfil = []; // Duplicado de aPerfiles, para pruebas
var cBoletin = "x";
var cCarDoc = "x";   
var nLineas = 0; //Contador de las lineas cargadas en la búsqueda de Google
var nVeces = 0; //Contador de las tres vueltas para bajar primeras 30 consultas    
var cUrl = "c";
 
var cBuscar;

var aEnlaces = [];

var aLinksLocales = [];  //Guarda todos los PDF locales para ser convertidos a texto

//var cVia2 = getiMacrosFolder("Downloads")+DetectaBS()+"tellez2.pdf";
    
//BajarCanal( cVia2, "https://bop.dipgra.es/paginasbop/20140811002.pdf" );


findText("Hola");


if (  SiExiste( cFicPar )   )

{
  aBoletines = File2Array( cFicPar );
  HuboError("Cargados los valores de Sedes Electrónicas de BOLETINES OFICIALES PÚBLICOS.");
}

nElegido = Elige( aBoletines,  cVersion, "Elija el site del boletin electrónico a BUSCAR");

if (nElegido > 0 || nElegido == 0 )
  {
  cBoletin = aBoletines[nElegido]; 
  HuboError("Se ha elegido para BUSCAR en el contenido del BOLETIN ELECTRONICO " + cBoletin );
  }    
   
else
  { Popitas3("Debe Elegir un BOLETIN", "DEBERIA ELEGIR UNO!!!! "+ nElegido.toString() );}

cBuscar = window.prompt("Teclee lo que quiere buscar: ");

cBuscar = cBuscar.toUpperCase();

cTiempo = gTiempo()+DameUnico();  //Nombre de la carpeta
cTiempo = replaceAll( cTiempo, " ", "_" );

HuboError("Se va a ALMACENAR todo lo encontrado en la carpeta " + cTiempo );
CreaSubDir(cTiempo);    // Crea la carpeta temporal

//GrabaFic( cFile, cTiempo )
GrabaFic( cTiempo+imns.FIO.psep+cBuscar, cVersion );
GrabaFic( cTiempo+imns.FIO.psep+cBuscar, cBuscar );
GrabaFic( cTiempo+imns.FIO.psep+cBuscar, cBoletin );
HuboError(cBuscar+" en "+cBoletin +" " + cBuscar+" " + cTiempo);
Texto2Head(cBuscar+" en "+cBoletin, cBuscar+".html", cTiempo);


 //CONTENT=EVENT:SAVETARGETAS"
  
   CargaGL( cBuscar, cBoletin, 10 );   
// if (  BuscaHTML( "no obtuvo ningún resultado") == false )
// {  
   gDescarga( cBuscar, cTiempo );
     

   CargaGL( cBuscar, cBoletin, 20 );
   gDescarga( cBuscar, cTiempo );
  
   CargaGL( cBuscar, cBoletin, 30 );
   gDescarga( cBuscar, cTiempo );     
/* }
 
 else
  
      { HuboError("No se han encontrado coincidencias en ESA BUSQUEDA. Detenido.  ");}         
      
  */
      
      
      
Texto2Fin( cBuscar+".html", cTiempo );

var cDesde = getiMacrosFolder("Macros")+DetectaBS()+ "pdfobject.js" ;
var cPara = cVia = getiMacrosFolder("Downloads")+DetectaBS()+cTiempo+imns.FIO.psep+"pdfobject.js";

CopiaFile( cDesde , cPara ) ;
VuelcaTxt();
/*
 Datos fichero perfiles en tabla aPerfiles

CreaSubDir ("Carpeta0");
CreaArboleda ( "Carpeta1",  "Carpeta2", "Carpeta3");

*/



function CargaGL(cBusca, cDonde, nCuantos)
{
  iimSet(  "texto", cBusca ); // texto a buscar
  iimSet(  "sitio", cDonde ); //Boletín electrónico
 // iimSet(  "numero", nLineas ); //     
  iimSet(  "paginado", nCuantos );   // Resultados de la búsqueda por paginado de 10 en 10
    // Bucle 10 entradas, para descargar
    var cMacro = "CODE:";
    
  cMacro +="URL GOTO=https://www.google.es/search?gws_rd=cr,ssl&q=site:{{sitio}}<sp>filetype:pdf<sp>'{{texto}}'&start={{paginado}}"+"\n";
//  cMacro +="URL GOTO=https://www.google.es/search?gws_rd=cr,ssl&q=site:{{sitio}}<sp>'{{texto}}'&start={{paginado}}"+"\n";
  cMacro +="WAIT SECONDS=5"+"\n";
  //cMacro +="TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:f ATTR=NAME:btnG"+"\n";
  iimPlay(cMacro);      
  HuboError(   'Se ha cargado GOOGLE.ES con la búsqueda' );   
      
	   
return cMacro;      
}


 
function GetiMacros()
{
//Internals

var wm = imns.Cc["@mozilla.org/appshell/window-mediator;1"].getService(imns.Ci.nsIWindowMediator);
var win = wm.getMostRecentWindow("navigator:browser");
var iMacros = win.iMacros;
return iMacros;
  
}




function IniciaMacro()
{
var   cMacro =  "CODE:";
      cMacro +="VERSION BUILD=8300326 RECORDER=FX"+"\n";
      cMacro +="SET !EXTRACT_TEST_POPUP NO"+"\n";
      cMacro +="SET !ERRORIGNORE YES"+"\n";
      cMacro +="SET !ERRORCONTINUE YES"+"\n";
      cMacro +="SET !REPLAYSPEED FAST"+"\n";     
      cMacro +="SET !WAITPAGECOMPLETE YES"+"\n";
      cMacro +="SET !TIMEOUT_STEP 60"+"\n";
      cMacro +="SET !TIMEOUT 180"+"\n"; 
      cMacro +="CLEAR"+"\n";
return cMacro;      
}



  
function HuboError(cTexto)
{

    var miError = iimGetLastError();
    miError = cTexto + " " + miError;

    GrabaLog( miError);
    Popitas2("Aviso", cTexto);
}



function GrabaFic( cFile, cDatos )
{
 var dTime = new Date();
 var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cFile;
 var oFile = imns.FIO.openNode(cVia);
 return (imns.FIO.appendTextFile( oFile, cDatos+DetectaCR() ) );
}


function GrabaLog( cTexto1 )
{
  GrabaFic ( cFicErr, cTexto1 );
}



function getiMacrosFolder(folderName)
    {
       var pname;
       switch (folderName)
       {
          case "Macros" :
             pname = "defsavepath";
             break;
          case "DataSources" :
             pname = "defdatapath";
             break;
          case "Downloads" :
             pname = "defdownpath";
             break;
          case "Logs" :
             pname = "deflogpath";
             break;
          default :
             throw folderName + " is not a valid iMacros folder name";
             break;
       }
       return imns.Pref.getFilePref(pname).path;
    }


    
    
    
function DetectaBS()
{
var cBS = "";
var cNT ="WINNT";
cBS = "\\";

var cOpSys = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;

if (cOpSys != cNT)
    {  cBS  = "/";  }                        
    
return cBS; }




function DetectaCR()
{
var cCR = "\n";
var cNT ="WINNT";

var cOpSys = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;

if (cOpSys != cNT)
    {  cCR  = "\r\n";  }                        
    
return cCR;
}



   
  
  
  
  


/*
https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFile#Attributes

Devuelve las entradas que cuelgan de cCarpeta

Maneja el sistema de archivos independiente del S.O.

 */

function DameFS( cCarpeta)
{
var root = new FileUtils.File(cCarpeta);
var drivesEnum = root.directoryEntries, drives = [];
while (drivesEnum.hasMoreElements()) {
  drives.push(drivesEnum.getNext().
    QueryInterface(Components.interfaces.nsILocalFile).path);}
  return drives; 
}
   
   // document.querySelector('#filelist').appendChild(fragment);
   

   
   function Cuidado(cTitulo, cTexto)
   {  
   var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);

   var lCheck = {value: false};                      // default the checkbox to false

   var nDevuelve =  prompts.alertCheck(null, cTitulo, cTexto,cTexto2, lCheck);
   
   return nDevuelve;
   }
   
   
   function Alerta( cTitulo, cTexto)
   {
    Services.prompt.alert(null, cTitulo, cTexto);
   }
   
   
   
    function getLocalDirectory() 
    { 
        var directoryService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties); 
         var localDir = directoryService.get("ProfD", Ci.nsIFile); 
    localDir.append("FolderName"); 
    if (!localDir.exists() || !localDir.isDirectory())  
        localDir.create(Ci.nsIFile.DIRECTORY_TYPE, 0774); 
    return localDir; 
    }






function CreaSubDir (cCarpeta)
  
   {
    var oCarpetaD  = imns.FIO.openNode(getiMacrosFolder("Downloads") );
    oCarpetaD.append(cCarpeta);
    var oResultado = imns.FIO.makeDirectory(oCarpetaD.path);  
     
   }
   

function CreaArboleda (cCarpeta1, cCarpeta2, cCarpeta3)
  
   {
    var oCarpetaD  = imns.FIO.openNode(getiMacrosFolder("Downloads") );
    var oResultado = imns.FIO.makeDirectory(oCarpetaD.path);  
    oCarpetaD.append(cCarpeta1);
    oResultado = imns.FIO.makeDirectory(oCarpetaD.path);  
    oCarpetaD.append(cCarpeta2);
    oResultado = imns.FIO.makeDirectory(oCarpetaD.path);  
    oCarpetaD.append(cCarpeta3);
    oResultado = imns.FIO.makeDirectory(oCarpetaD.path);  
        
   }

    
    
function Elige( aValores, cTitulo, cTexto) 
{
 var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
 var lResultado = false;
  
 var nIndice = {};

 var lResultado = prompts.select(window, cTitulo, cTexto, aValores.length,
				 	 aValores, nIndice);
 

 if (lResultado == false)
 {
   nIndice = {};
 }

return nIndice.value;


}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

function AgregaFile(cFile)
{
var uri = Components.classes["@mozilla.org/network/io-service;1"].
  getService(Components.interfaces.nsIIOService).
  newURI("file:///C:/test.txt", null, null);
alert(uri); // [xpconnect wrapped nsIURI]
FileToAttachment(uri); // same error as above


var localFile = Components.classes["@mozilla.org/file/local;1"].
  createInstance(Components.interfaces.nsILocalFile);
localFile.initWithPath("C:\\test.txt");
alert(localFile); // [xpconnect wrapped nsILocalFile]
alert(FileToAttachment(localFile)); // [xpconnect wrapped nsIMsgAttachment]
}


function LeerObj( oObjetoFP )
 {

var oFiles = oObjetoFP.files;
    var aPaths = [];
    while (files.hasMoreElements()) 
    {
        var oArg = files.getNext().QueryInterface(Components.interfaces.nsILocalFile).path;
        aPaths.push(oArg);
    } 
    aPaths;
    
    }
    
    
    
     
function getUser() {
var cDir = 'HOME';
if (DameOS() == 'WINNT')
    { cDir = 'USERNAME';  }
   return Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get(cDir);
}      

function DameOS()
{
var  cOpSys = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
return cOpSys;
}



function SiExiste( cFichero )
{
  var cExiste = 0;
  var file = new FileUtils.File(getiMacrosFolder("DataSources")+DetectaBS()+cFichero );

   if ( file.exists() == true )
      {
          cExiste = 1;
       }

return cExiste;
}




function LeeFic( cFile)
{
 var cVia = getiMacrosFolder("DataSources")+DetectaBS()+cFile;
 var oFile = imns.FIO.openNode(cVia);
 var cTexto = imns.FIO.readTextFile(oFile);
 return cTexto;
}

 

  


function File2Array(cFile)
{

var cTexto =  LeeFic( cFile);
var aTexto = [];

//split(/\r?\n/);
 aTexto = cTexto.split("\r\n");
 aTexto =  cTexto.split("\r");
 cTexto.split("\n");
 cTexto.split(/\r?\n/);
 cTexto.match(/[^\r\n]+/g);
 aTexto = cTexto.split(/\r?\n/);
 aTexto = cTexto.split(/\r\n\r\n/);
 aTexto = cTexto.replace(/\r\n/g, "\n").split("\n")
 aTexto = cTexto.match(/[^\r\n]+/g); 
return aTexto;

}


        



function isEmpty(str) {
    return (!str || 0 === str.length);
}



function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}









/*

SCREENSHOT TYPE=(PAGE|BROWSER) FOLDER=folder_name FILE=file_name

cd C:\Program Files (x86)\Mozilla Firefox
start firefox.exe
ping -n 05 127.0.0.1>nul
start /wait firefox.exe imacros://run/?m=accounts.iim
ping -n 20 127.0.0.1>nul
move /Y "C:\downloads\XSAreport*.csv" "Z:\printers\accounts\%date:~-10,2%-%date:~-7,2%-%date:~-4,4%_XSAreport.csv"
del C:\downloads\*.* /F /Q


NDOWNLOAD FOLDER=* FILE=+_image_{{!NOW:yyyymmdd_hhnnss}}  
'
'Download the picture
TAG POS=1 TYPE=IMG ATTR=HREF:http://*.jpg CONTENT=EVENT:SAVEITEM
'
'You can also use the EVENT:SAVE_ELEMENT_SCREENSHOT command instead
'TAG POS=1 TYPE=IMG ATTR=HREF:http://*.jpg CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT 
'
'Or you can take a snapshot of the complete web page
'SAVEAS TYPE=BMP FOLDER=* FILE=MySnapshot_{{!NOW:yyyymmdd_hhnnss}}.bmp 

*/


function scrollMsg( cMsg)
{


var counter = 0;
var msg = cMsg;
    if (counter < 10)
    {
        window.status = msg;
        msg = msg.substring(1,msg.length) + msg.substring(0,1);
        window.setTimeout("scrollMsg()",150);
        counter += 1
    } 
    else
     {
        window.status = "";
    }
}

//no obtuvo ningún resultado
function BuscaHTML( cTexto)
{
var lValido = false;
var cTextoPag = document.getElementsByTagName('body')[0];

//cTextoPag = document.getElementsByTagName('body')[0].innerHTML;

if(cTextoPag.indexOf(cTexto) == -1)
{
  lValido = false;
}
else
{
  lValido = true;
}

return lValido;
}

//h1Icons




function DameLoader()
{
var someURL = "resource://gre/modules/JSON.jsm"; 
var oLoader = {}; 


var oSrvLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                       .getService(Components.interfaces.mozIJSSubScriptLoader); 
oSrvLoader.loadSubScript(someURL, oLoader); 
return oLoader;



}



function Popitas(title, msg) {
  var image = null;
  var win = Components.classes['@mozilla.org/embedcomp/window-watcher;1']
                      .getService(Components.interfaces.nsIWindowWatcher)
                      .openWindow(null, 'chrome://global/content/alerts/alert.xul',
                                  '_blank', 'chrome,titlebar=no,popup=yes', null);
  win.arguments = [image, title, msg, false, ''];
}




function Popitas2(title, text) {
  try {
    Components.classes['@mozilla.org/alerts-service;1']
              .getService(Components.interfaces.nsIAlertsService)
              .showAlertNotification(null, title, text, false, '', null);
  } catch(e) {
    // prevents runtime error on platforms that don't implement nsIAlertsService
  }
}



function Popitas3(cTitulo, cTexto)
{

var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win = wm.getMostRecentWindow("navigator:browser");
 


var message = cTexto;
var box = win.gBrowser.getNotificationBox();
var notification = box.getNotificationWithValue(cTitulo);
if (notification) {
    notification.label = message;
}
else {
    var buttons = [{
        label: 'Button',
        accessKey: 'B',
        popup: 'blockedPopupOptions',
        callback: null
    }];

    var priority = box.PRIORITY_WARNING_MEDIUM;
    box.appendNotification(message, 'popup-blocked',
                           'chrome://browser/skin/Info.png',
                            priority, buttons);
}

}




function Pausar( nMS )
{
 var dFecha = new Date(),
     dAhora = null;
     do { dAhora = new Date(); }

     while ( daHora - dFecha < nMS );
}

     
 
 

// Descarga 10 entradas del buscador Google y las almacena     


function gDescarga(cNomDes1, cCarpeta1 )
{
 nItem = 1;
do {

     //cNomDes1 = cNomDes1 + nItem.toString();
     gDescarga10( nItem, cNomDes1 , cCarpeta1 );
          ++nItem;
          } 
while (nItem < 11 );
 
        
} 
function gDescarga10( nLinea, cNomDes, cCarpeta )
{


HuboError("Se va a descargar " + cNomDes + " " + cCarpeta + " línea " + nLinea.toString()   );
// Bajar(cVia, cURL);

           
var cLink, cDesLink, cMacro, cVia;

//cTiempo+imns.FIO.psep+cBuscar

 cVia = getiMacrosFolder("Downloads")+imns.FIO.psep+cCarpeta;

// window.alert(cVia);
 
// cNomDes = replaceAll( cNomDes, " ", "_" );

// window.alert(cNomDes);
 
iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
iimSet(  "fichero", cNomDes ); // nombre del fichero cuando se haya descargado
iimSet(  "carpeta", cVia); // nombre de la carpeta del expediente


//span class=st  TEXTO BUSQUEDA
 
 cMacro =  IniciaMacro();
cMacro +="TAG POS={{linea}} TYPE=SPAN ATTR=CLASS:st extract=TXT" + "\n";
//AG POS=1 TYPE=H3 ATTR=CLASS:r extract=HTM
//<cite class="_Rm">
//TAG POS=2 TYPE=CITE ATTR=CLASS:_Rm extract=TXT
//saveas type=extract folder={{carpeta}} file={{fichero}}.txt


cMacro +="saveas type=extract folder={{carpeta}} file={{fichero}}st.txt" + "\n";
//cMacro +="SET !EXTRACT NULL" + "\n";
iimPlay(cMacro);


 
iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
iimSet(  "fichero", cNomDes ); // nombre del fichero cuando se haya descargado
iimSet(  "carpeta", cVia); // nombre de la carpeta del expediente
 cMacro =  IniciaMacro();
cMacro +="TAG POS={{linea}} TYPE=H3 ATTR=CLASS:r extract=HREF" + "\n";
cMacro +="saveas type=extract folder={{carpeta}} file={{fichero}}link.txt" + "\n";
iimPlay(cMacro);



                                           //  // BajarCanal( cFile, cURL )
iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
cMacro ="CODE:TAG POS={{linea}} TYPE=SPAN ATTR=CLASS:st extract=TXT" + "\n";   
iimPlay(cMacro);
cUrl = DameEx(); 
if (cUrl == "vacío" )    
   {
    HuboError("No se encuentran en esa posición TEXTO de resultados. Se va a obviar este enlace. CLASS st");
   }
else
   {
    HuboError(cDesLink);
    cDesLink = cUrl;
    // TYPE=H3 ATTR=CLASS:R extract=href
    HuboError("Se ha encontrado TEXTO en la entrada nº " + nLinea.toString() + " " +  + " " + cDesLink );

    iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
    iimSet(  "fichero", cNomDes ); // nombre del fichero cuando se haya descargado
    iimSet(  "carpeta", cVia); // nombre de la carpeta del expediente
    cMacro =  IniciaMacro();
    cMacro +="TAG POS={{linea}} TYPE=CITE ATTR=CLASS:_Rm extract=TXT" + "\n";
    cMacro +="saveas type=extract folder={{carpeta}} file={{fichero}}.txt" + "\n";
    iimPlay(cMacro);  
      
    
    iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
    cMacro ="CODE:TAG POS={{linea}} TYPE=CITE ATTR=CLASS:_Rm extract=TXT" + "\n";
    iimPlay(cMacro); 
    cUrl = DameEx();      
    if (cUrl == "vacío" )    
       {      
       HuboError("No se encuentran coincidencias para ser un enlace a PDF. Se va a obviar este enlace. CLASS_ Rm");      
       iimSet(  "linea", nLinea.toString() ); // entrada de resultados de gOOgle
       cMacro ="CODE:TAG POS={{linea}} TYPE=H3 ATTR=CLASS:r extract=HREF" + "\n";
       iimPlay(cMacro); 
       cUrl = DameEx();      
                      
      if (cUrl == "vacío" )   
         { 
           HuboError("No se encuentran coincidencias de enlace HTML-WEB. Se va a obviar esta entrada. CLASS f1"); 

         }
      else
        { 
         cLink = cUrl; 
         HuboError("Se ha conseguido extraer el link al item HTML " + cLink );
         HuboError("Se ha grabado de GOOGLE entrada SINPDF nº " + nLinea.toString() + "en " + cNomDes + " en la carpeta " + cCarpeta );
         Texto2Body(cDesLink, cLink, cBuscar+".html", cTiempo) ;         

        }         

//      
      }  
   else
     {
      cLink = cUrl; 
      HuboError("Se ha conseguido extraer el link al PDF " + cLink );
      HuboError("Se ha grabado de GOOGLE entrada SOLOPDF nº " + nLinea.toString() + "en " + cNomDes + " en la carpeta " + cCarpeta );
      Texto2Body(cDesLink, cLink, cBuscar+".html", cTiempo) ;         

    }
      
                    



}
//


}


// String de fecha
function gTiempo()
{

 var dTime = new Date();
 var nMes= dTime.getMonth()+1; // Ajuste de Javascript
 var nDiaMes = dTime.getDate();
 var nAno = dTime.getFullYear();
 var cMes, cDia

 if ( nMes > 9 )
   {cMes = nMes.toString() }
 else
   {cMes = "0" + nMes.toString() }

 if ( nDiaMes > 9)
    {  cDia =  nDiaMes.toString() }
 else
    {  cDia = "0" + nDiaMes.toString()}

 var cTiempo = nAno.toString()+cMes+cDia;
 return  cTiempo ;


}                                                   


function DameUnico()
{
    var text = "";
    var possible = "_-0123456789";

    for( var i=0; i < 6; i++ )
        {text += possible.charAt(Math.floor(Math.random() * possible.length));}

    return text;
}


function ExDateTime()
{
     var cFechaTiempo = ' ';

     var fecha =  new Date();
     var Ano = fecha.getFullYear();//el año se puede quitar de este ejemplo
     var Mes = fecha.getMonth();//pero ya que estamos lo ponemos completo
     var Dia = fecha.getDate();
     var hora = fecha.getHours();
     var minutos = fecha.getMinutes();
     var segundos = fecha.getSeconds();
     //aquí se hace lo 'importante'
     if(Mes<10){Mes='0'+Mes}
     if(Dia<10){Dia='0'+Dia}
     if(hora<10){hora='0'+hora}
     if(minutos<10){minutos='0'+minutos}
     if(segundos<10){segundos='0'+segundos}
     cFechaTiempo = Ano + '/'+ Mes + '/' + Dia + '-' + hora+':'+minutos+':'+segundos;
return cFechaTiempo;
 
}





function GrabaHTML(cFichero, cTexto)
{
     
 var cHTM = " " ;
    


 
 
}


function DameEx()
{
   cExtracto = iimGetExtract();

  // #EANF# means Extract Anchor Not Found (ie extract failed)
  if (cExtracto === '#EANF#') 
       {     cExtracto = "vacío" ;   }       
       
HuboError("Ultima extracción es " + cExtracto)      ;       
     
return cExtracto;     


}



function CogeTexto()
{

var selectedText = document.commandDispatcher.focusedWindow.getSelection().toString();

var Seleccionado = content.getSelection(); 

window.alert(selectedText );


}

 

function BajarCanal( cFile, cURL )
{

var oIOService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)

var oLocalFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
    
    oLocalFile.initWithPath(cFile);

HuboError("Se va a descargar "+ cURL + " en " +  cFile);

var oDownloadObserver = {onDownloadComplete: function(nsIDownloader, nsresult, oFile) {console.log('download complete...')}};

var oDownloader = Cc["@mozilla.org/network/downloader;1"].createInstance();
oDownloader.QueryInterface( Ci.nsIDownloader );
oDownloader.init(oDownloadObserver, oLocalFile);

var oHttpChannel = oIOService.newChannel(  cURL, "", null);
oHttpChannel.QueryInterface( Ci.nsIHttpChannel);
oHttpChannel.asyncOpen(oDownloader, oLocalFile);   
}





function Texto2Head(cTitulo, cFichero, cVia)
{
   
aEnlaces = [];

var cLinea = '﻿<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" ' ;
aEnlaces.push(cLinea);


cLinea = '  "http://www.w3.org/TR/html4/strict.dtd"> ';
aEnlaces.push(cLinea);

cLinea = '  <head> ';
aEnlaces.push(cLinea);


cLinea = '<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"> ';
aEnlaces.push(cLinea);

cLinea = '<meta http-equiv="Content-Style-Type" content="text/css"> ';
aEnlaces.push(cLinea);

cLinea = '<meta http-equiv="Content-Script-Type" content="text/javascript"> ';
aEnlaces.push(cLinea);
                                  
 
cLinea = "<title>" + cTitulo + "</title>";
aEnlaces.push(cLinea);
              

//http://pipwerks.com/d/13
cLinea = '<script type="text/javascript" src="pdfobject.js"></script>';
aEnlaces.push(cLinea);
              
  //PDFObject({ url: "www.google.com" }).embed();
cLinea = '<script type="text/javascript"> ';
aEnlaces.push(cLinea);
                   
cLinea = "function LeePdf ( cPdf ){";

//PDFObject({ url: "www.google.com" }).embed();
aEnlaces.push(cLinea);                         
     //var myPDF = new PDFObject({ url: cPdf, pdfOpenParams: { search: 'duran' }   }).embed(); 
 cLinea = "var myPDF = new PDFObject({ url: cPdf, pdfOpenParams: { search: '"+ cBuscar+"' }  }).embed();}";
aEnlaces.push(cLinea);              




//url: 'http://pipwerks.com/d/13',
      //pdfOpenParams: { search: 'espejo gonzalez' }


 //cLinea = "var myPDF = new PDFObject({ ";
//aEnlaces.push(cLinea);              

/*   
 cLinea = " url: cPdf, ";
aEnlaces.push(cLinea);              
 cLinea = "  pdfOpenParams: { search: '" + cBuscar + "' } ";
aEnlaces.push(cLinea);     

cLinea =  " }).embed(); }";
aEnlaces.push(cLinea);
*/
    cLinea = "window.find('" + cBuscar + "')";
aEnlaces.push(cLinea);              
   
//   window.find("JavaScript")
 cLinea =  " </script>";
aEnlaces.push(cLinea);


cLinea = "</head>";
aEnlaces.push(cLinea);      

cLinea = '<body style="font-family: verdana; font-size: 12px"><div>';
aEnlaces.push(cLinea);


cLinea =  '<h1>BÚSQUEDA: '+ cTitulo + "</h1>"    ;
aEnlaces.push(cLinea); 

                             

cLinea =  '<h2>'+ cVersion + "</h2>"    ;
aEnlaces.push(cLinea); 
// var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cFile;

cLinea =  '<h3>Generador de DICCIONARIO DE DATTOS de TRAZAS</h3>'
aEnlaces.push(cLinea); 
cLinea =  '<h3>Gestión DOCUMENTAL de TRAZAS en Boletines OFICIALES (PDF-HTML)</h3>'
aEnlaces.push(cLinea); 
cLinea =  '<h3>Trazabilidad de DERECHOS Y OBLIGACIONES EN FUENTES DE ACCESO AL PÚBLICO</h3>'
aEnlaces.push(cLinea); 
cLinea =  '<h4>Ley Orgánica LOPD art. 3j 15/1999</h4>'
aEnlaces.push(cLinea); 

cLinea =  '<h4><font color="red">Desarrollado por juanato@gmail.com</font></h4>'
aEnlaces.push(cLinea); 



// <a href="http://www.w3schools.com/html/">Visit our HTML tutorial</a> 
GrabaDoc( cFichero, cVia, aEnlaces.join(" \n") );        
//BajarCanal( getiMacrosFolder("Downloads")+DetectaBS()+cTiempo+DetectaBS()+"pdfobject.js", 'http://pipwerks.com/d/13' )

}



function GrabaDoc( cFile, cCarpeta,  cDatos )
{
 var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cCarpeta+DetectaBS()+cFile;
 var oFile = imns.FIO.openNode(cVia);
 return (imns.FIO.appendTextFile( oFile, cDatos ) );
}




function replaceAll( cTexto, cBusca, cReemplaza )
{

	  while (cTexto.toString().indexOf( cBusca ) != -1)

	    {  cTexto = cTexto.toString().replace( cBusca, cReemplaza ); }

return cTexto;
}            


//http://docs.google.com/gview?url=http://mesdomaines.nu/eendracht/include_pdf/pdf1.pdf&amp;embedded=true

//%23search/149d1cd5bce80fc1
                            

//Texto2Body(cDesLink, cLink, cNomDes, cVia) ;

function Texto2Body(cTitulo, cLink, cFichero, cVia)
{
              
const cDocs = "https://docs.google.com/gview?url=";
const cDocs2      = "&q=" + cBuscar;
var cNombreLocal;
var cNombretxt;
var cCarpeta = getiMacrosFolder("Downloads")+DetectaBS()+cVia;
var cLinea;


aEnlaces = [];


cNombreLocal = cLink.substring(cLink.lastIndexOf("/") + 1 );
cNombretxt = cLink.substring(cLink.lastIndexOf("/") + 1 );
cNombretxt = cNombretxt.substring(0, cNombretxt.lastIndexOf(".") )+".txt"; 

HuboError("Descargando fichero " + cNombreLocal + " apuntando a  " + cLink + " en la carpeta " + cVia  );
HuboError("Luego se convertirá a " + cNombretxt + " en la carpeta " + cVia  );

  //BajarCanal( cFile, cURL )
BajarCanal( cCarpeta+imns.FIO.psep+cNombreLocal, "https://"+cLink );
aLinksLocales.push(cCarpeta+imns.FIO.psep+cNombreLocal); // Para luego poder convertir a texto
HuboError("Se va a grabar la entrada HTML " + cTitulo + " apuntando a " + cLink + " en la carpeta " + cVia + " en el fichero " + cFichero );   




cLinea = '  <br><br> ' ;      
aEnlaces.push(cLinea);


cLinea = '  <br>Ver usando GoogleDOCS ONLINE<br> ' ;      
aEnlaces.push(cLinea);

cLinea = cDocs + "https://"+cLink + cDocs2;       
cLinea = '  <a href =  ' + cLinea + " style=color:green> "+cTitulo+"</a>"  ;
//aEnlaces.push(cLinea);      
//C:\Users\Suma7\Documents\iMacros\Downloads\201505254018-_\alfredo.html

cLinea = '<h1>'+ cLinea + "</h1>"    ;
aEnlaces.push(cLinea);      
     

cLinea = '<br>Ver fichero descargado con Adobe Acrobat en esta carpeta<br>' ;   ;
aEnlaces.push(cLinea);      

//Cortamos el link al fichero local, descargado
//javascript:LeePdf( " 090622.pdf")               
//"javascript:LeePdf("030707.pdf") style="color:red>""                       
//C:\Users\Suma7\Documents\iMacros\Downloads\20150526061015\espejo gonzalez.html      
//href =" javascript:LeePdf( " 070719.pdf")"style="color:red">           
//javascript:call_func();
cLinea = '<a href =' + 'javascript:LeePdf("' +  cNombreLocal +  '");'+' style="color:red'+ '">'+cTitulo+"</a>"  ;
aEnlaces.push(cLinea);
cLinea = " <br>" ;
aEnlaces.push(cLinea);


Linea = '<br>Ver fichero txt CONVERTIDO desde el PDF en esta carpeta<br>' ;   ;
aEnlaces.push(cLinea);      
cLinea = '<a href =' +  cNombretxt + " " + ' style="color:coral"' + ">" + cTitulo +"</a>"  ;
aEnlaces.push(cLinea);
cLinea = " <br>" ;
aEnlaces.push(cLinea);




GrabaDoc( cFichero, cVia, aEnlaces.join(" \n") );     



//Texto2Head(cBuscar+cBoletin, cBuscar+".html", cTiempo);
}     
   
function Texto2Fin(cFichero, cVia)
{
HuboError("Se ha finalizado de crear el fichero HTML " +  " en " + cFichero + " en la carpeta " + cVia );       
aEnlaces = [];
cLinea = "</body>";
aEnlaces.push(cLinea);
cLinea = "</html>";
aEnlaces.push(cLinea);
GrabaDoc( cFichero, cVia, aEnlaces.join(" \n") );    

//Texto2Head(cBuscar+cBoletin, cBuscar+".html", cTiempo);
}                              






function CopiaFile(from,to)
{
   var to_folder=to.substring(0,to.lastIndexOf(DetectaBS())+1);
   var to_file=to.substring(to.lastIndexOf(DetectaBS())+1);


   var source = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);   
   source.initWithPath(from);
   var target = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);   
   target.initWithPath(to_folder);   
    source.copyTo(target,to_file);
 }
 
 
 
 
 function VuelcaTxt()
 {
  var nCuenta = 0;
  var nFinal = aLinksLocales.length;
 
 // Sirve que el total no sepa que la posición final es nTotal-1

while ( nCuenta < nFinal )
 {
   Convierte( aLinksLocales[nCuenta] ); 
    ++nCuenta;
  }

 
 
 }
 




function Convierte( cFile1 )

{                // Ojo que ejecutamos en /Macros
        var cVia, cRunOS, cCmdLine, cTmpFile, oFile, cSufijo ;    

              cVia =  getiMacrosFolder("Macros")+imns.FIO.psep+"poppler-0.33.0"+imns.FIO.psep+"bin"+imns.FIO.psep;
              cSufijo = ".sh";
          if ( DameOS() == "WINNT" )
           { cRunOS = "call ";
             cSufijo = ".cmd"; }
          if ( DameOS() == "Linux" )
           { cRunOS = "wine ";}
          if ( DameOS() == "Darwin" )
           { cRunOS = "bash ";}
           cCmdLine = " ";           
           cCmdLine = cCmdLine + "echo CONVERSION FICHERO PDF-TXT " + DetectaCR();

           cCmdLine = cCmdLine + imns.str.trim(cRunOS + " " + cVia +'pdftotext.exe'+ " " +  cFile1);            
           cCmdLine = cCmdLine +  DetectaCR();        


           cTmpFile = "corre"+DameUnico()+cSufijo;
           
           
          oFile = imns.FIO.openNode(imns.str.trim(cVia +cTmpFile));         
          imns.FIO.writeTextFile( oFile, cCmdLine + DetectaCR() );
          oFile = Components.classes["@mozilla.org/file/local;1"].getService(Components.interfaces.nsILocalFile);
          oFile.initWithPath(cVia +cTmpFile);
          oFile.launch();
}                                     



            



function findText(cTexto){
                var oRange = document.body.createTextRange();
                var sBookMark = oRange.getBookmark();
                if(oRange.findText( cTexto ))
                {
                    oRange.moveToBookmark(sBookMark);
                    oRange.select();
                    document.body.scrollTop = oRange.offsetTop;
                }
                else
                {
                    alert('Not Found');
                }
                
            }

