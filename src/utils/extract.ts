import { FinalJson } from '../types/final';

const buscarTexto = (texto: string, valores: string[]) => {
  for (let i = 0; i < valores.length; i++) {
    if (texto.includes(valores[i])) {
      return valores[i];
    }
  }
  return 'Ninguno de los valores está presente en el texto.';
};

const titles: Record<string, string> = {
  FUNDACION: 'PROTOCOLO DE FUNDACIÓN',
  VACIADO: 'PROTOCOLO DE PRE VACIADO',
};

export const extract = (text: string): FinalJson => {
  // console.log(text);
  const textNomalize = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const valueee = buscarTexto(textNomalize, Object.keys(titles));
  const firstTitle = titles[valueee];

  const regexArea = /AREA DE TRABAJO:\s*([^\n]+)/;
  const matchArea = regexArea.exec(text);
  const value = matchArea!.toString().split(' FECHA: ');
  const areaTrabajo = value[0];
  const fecha = value.pop()!;

  const regexDesc = /DESCRIPCION:\s*([^\n]+)/;
  const matchDes = regexDesc.exec(textNomalize)!;
  // if (!matchDes) return;
  const matchDes1 = matchDes[0];
  const descripcion = matchDes1.split(' ELABORADO POR:').shift();

  const regexActiv = /ACTIVIDAD:\s*([^\n]+)/;
  const matchActv = regexActiv.exec(textNomalize)!;
  // if (!matchActv) return;
  const matchActv1 = matchActv[0];
  const actividad = matchActv1.split(' ELABORADO POR:').shift();

  const regexProtocol = /PROTOCOLO:\s*([^\n]+)/;
  const matchProto = regexProtocol.exec(textNomalize)!;
  // if (!matchActv) return;
  // console.log(matchProto);
  const matchProto1 = matchProto[0];
  const protocolo = matchProto1.split('PROTOCOLO: ').pop()!;
  // console.log(protocolo);
  const title = `${firstTitle} - ${areaTrabajo} - ${descripcion} - ${actividad}`;
  let commen = '';
  if (title.length > 255) {
    title.slice(0, 255);
    commen += title.split('-').pop();
  }
  const finalJson = {
    'Nro de Documento': protocolo,
    Revisión: 0,
    Título: `${title} - ${areaTrabajo} - ${descripcion} - ${actividad}`,
    tipo: 'PROTOCOLO',
    Status: 'EMITIDO PARA INFORMACIÓN',
    Disciplina: '',
    'Nombre del proyecto': 'LP13692S - FIRENO Ferrobamba fase 5 infra',
    'Facilites Code Lb': '0131 - Fuel & Lube Storage & Dispensing',
    'Facilites Code CB': 'N/A',
    'Área Funcional': 'N/A',
    'Oc o Contrato': 'CW2253271',
    'Deliverable Class': 'SUPPLIER DOCS',
    'PPM Código': '5200P-013692 - Pit FB Phase 7 Infrastructure',
    Atributo1: '',
    Archivo: '',
    'Tamaño de impresión': '',
    'Fecha de emisión': fecha,
    'Fecha del hito': '',
    'Fecha prevista de envio': '',
    'Fecha de reporte Diario': '',
    Autor: 'FIRENO S.A.C.',
    Comentarios: commen,
    'N° Tag/Equipo': '',
    Sustituir: '',
  };
  // console.log(finalJson);
  return finalJson;
  // toXlsx([finalJson]);
};
