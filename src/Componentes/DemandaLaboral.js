import React from 'react'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { browserHistory } from 'react-router-3';

import CONFIG from '../Configuracion/Config'
import Alumno from './Alumno'
import AlumnoCodigo from './AlumnoCodigo'
import Select from 'react-select';
import swal from 'sweetalert';

class DemandaLaboral extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      estado: 0,
      idPrograma: '',
      //valores para los select
      optionsTipoPrograma: [],
      optionsCurriculos: [],
      programas: [],
      programasBD: [],
      select_programas: [],
      programa_actual: { value: "-1", label: "Seleccione un programa" },
      tipo_programa: [{ value: "03", label: "Maestria" }, { value: "05", label: "Doctorado" }, { value: "06", label: "Diplomatura" }],
      tipo_actual: { value: "-1", label: "Seleccione un tipo" },
      naturaleza: { value: "-1", label: "Seleccione naturaleza" },
      area: { value: "-1", label: "Seleccione area" },
      semestres: [],
      vacio: true,
      alumnosM: [],
      arregloAlumnos: [],
      programaSeleccionado: 0,
      alumnosM: [],
      cambiar: true,
      arregloProgramaOriginal: [],
      curriculos: [],
      perfilEgreso: [],
      cursosPlanEstudio: [],
      detalleEgreso: { id: 0, estado: 0, curriculo: 0, desc: 0, orden: 0 },
      detallePlan: { id: 0, plan: 0, ciclo: 0, cod_asig: 0, desc_asig: 0 }
    }

    this.Regresar = this.Regresar.bind(this);
    // this.handleChangeSelectPrograma=this.bind(this);
    this.alumno = '';
  }

  componentWillMount () {

    fetch(CONFIG + 'alumno/alumnoprograma/programa/programas')
      .then((response) => {
        return response.json();
      })
      .then((programa) => {

        this.setState({
          programasBD: programa
        })
      })

    let arreglo = [];

    fetch(CONFIG + 'alumno/alumnoprograma/programa/semestres')
      .then((response) => {
        return response.json();
      })
      .then((semestres) => {
        this.setState({
          semestres
        })

        Object.keys(semestres).map(key => (
          arreglo.push({ value: key, label: semestres[key].semestre })
        ))

        this.setState({
          optionsSemestrePrimer: arreglo,
          optionsSemestreSegundo: arreglo
        })
      })

  }

  handleChangeSelectTipo = (estado) => {
    this.setState({
      tipo_actual: { value: estado.value, label: estado.label }
    });

    let arreglo = [];
    switch (estado.value) {


      case "03": Object.keys(this.state.programasBD).map(key => (
        // console.log(this.state.programas[key].label.split(" "[0])),
        (this.state.programasBD[key].nomPrograma.split(" ")[0] == "MAESTRIA") ? (
          arreglo.push({ value: this.state.programasBD[key].idPrograma, label: this.state.programasBD[key].nomPrograma })
        )
          : null,

        this.setState({
          programas: arreglo/**/
        })
      ))
        ; break;

      case "05": Object.keys(this.state.programasBD).map(key => (
        // console.log(this.state.programas[key].label.split(" "[0])),
        (this.state.programasBD[key].nomPrograma.split(" ")[0] == "DOCTORADO") ? (
          arreglo.push({ value: this.state.programasBD[key].idPrograma, label: this.state.programasBD[key].nomPrograma })
        )
          : null,

        this.setState({
          programas: arreglo/**/
        })
      ))
        ; break;

      case "06": Object.keys(this.state.programasBD).map(key => (
        // console.log(this.state.programas[key].label.split(" "[0])),
        (this.state.programasBD[key].nomPrograma.split(" ")[0] == "DIPLOMATURA:") ? (
          arreglo.push({ value: this.state.programasBD[key].idPrograma, label: this.state.programasBD[key].nomPrograma })
        )
          : null,

        this.setState({
          programas: arreglo/**/
        })
      ))
        ; break;
    }
  }

  handleChangeSelectPrograma = (estado) => {
    //if(estado!== null){
    this.setState({
      programa_actual: { value: estado.value, label: estado.label }
    });
    setTimeout(() => {
      this.seleccionarCur();
    }, 100);
  }

  handleChangeSelectCurriculo = (estado) => {
    this.setState({
      tipocurriculoInput: { value: estado.value, label: estado.label }
    });
    setTimeout(() => {
      this.obtenerPerfilEgreso();
      this.obtenerPlanEstudio();
    }, 100);
  }

  Regresar = (e) => {
    browserHistory.push('/vista/loginFormAdmi');
    e.preventDefault();
  }

  handleChangeSelectTipoPrograma = (estado) => {
    this.setState({
      TipopresupuestoInput: { value: estado.value, label: estado.label },
      vacio: false
    });
  }

  handleChangeSelectNaturaleza = (estado) => {

  }

  handleChangeSelectArea = (estado) => {

  }
  //Seleccionar Programa
  seleccionar = () => {
    fetch(CONFIG + 'alumno/alumnoprograma/programa/alumnosemestres/' + this.state.semestreInput1.label + "/" + this.state.semestreInput2.label + "/" + this.state.programaSeleccionado)
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        this.setState({
          alumnosM: resultado
        })

        console.log(this.state.arregloAlumnos)

      })
  }

  seleccionarCur = () => {
    fetch(CONFIG + 'alumno/alumnoprograma/programa/curriculo/' + this.state.programa_actual.value)
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        var optionsCurriculos = [];
        resultado.forEach(element => {
          optionsCurriculos = [...optionsCurriculos, { value: element.curriculo_id, label: element.curriculo_desc }]
        });
        this.setState({
          curriculos: resultado,
          optionsCurriculos
        })

        console.log(this.state.optionsCurriculos)

      })
  }

  obtenerPerfilEgreso = () => {
    fetch(CONFIG + 'alumno/alumnoprograma/programa/perfilEgreso/' + this.state.tipocurriculoInput.value)
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {


        this.setState({
          perfilEgreso: resultado,

        })

        // console.log(this.state.optionsCurriculos)

      })
  }

  obtenerPlanEstudio = () => {
    fetch(CONFIG + 'curso/programa/' + this.state.programa_actual.value + '/planestudio/' + this.state.tipocurriculoInput.label.slice(1))
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        //Limpieza de datos porque el backend esta mal hecho xd
        resultado.forEach(element => {
          element.numciclo = parseInt(element.numciclo[0])
          element.numcreditaje = parseInt(element.numcreditaje[0])
          element.planestudios = parseInt(element.planestudios)
          element.idPrograma = element.idPrograma.idPrograma
        });
        delete resultado.preferenciaList;
        this.setState({
          cursosPlanEstudio: resultado
        })
        console.log(this.state.cursosPlanEstudio)
      })
  }

  recorrerPerfilEgreso = () => {
    var indice = 1;
    return (
      (this.state.perfilEgreso.length > 0) ?
        Object.keys(this.state.perfilEgreso).map(key => (
          <div className="alcentro " key={key}>
            <div className="col-xs-12 row" >

              <div className="cuadro-borde col-xs-1  " id={"fila1-" + key}><div className="margenes-padding">{this.state.perfilEgreso[key].perfilegreso_id}</div></div>
              <div className="cuadro-borde col-xs-1  " id={"fila2-" + key}><div className="margenes-padding">{this.state.perfilEgreso[key].estado_id}</div></div>
              <div className="cuadro-borde col-xs-2  " id={"fila3-" + key}><div className="margenes-padding">{this.state.perfilEgreso[key].curriculo_id}</div></div>
              <div className="cuadro-borde col-xs-3  " id={"fila4-" + key}><div className="margenes-padding">{this.state.perfilEgreso[key].perfilegreso_desc}</div></div>
              <div className="cuadro-borde col-xs-2  " id={"fila5-" + key}><div className="margenes-padding">{this.state.perfilEgreso[key].perfilegreso_norden}</div></div>
            </div>
          </div>
        )) : (
          <div className="alcentro ">
            <div className="col-xs-12 row">
              <div className="cuadro-borde col-xs-9">Sin datos de alumnos</div>
            </div>
          </div>
        ))
  }

  recorrerPlanEstudio = () => {
    var indice = 1;
    return (
      (this.state.cursosPlanEstudio.length > 0) ?
        Object.keys(this.state.cursosPlanEstudio).map(key => (
          <div className="alcentro " key={key}>
            <div className="col-xs-12 row" >

              <div className="cuadro-borde col-xs-2" id={"fila1-" + key}><div className="margenes-padding">{this.state.cursosPlanEstudio[key].codAsignatura}</div></div>
              <div className="cuadro-borde col-xs-4" id={"fila2-" + key}><div className="margenes-padding">{this.state.cursosPlanEstudio[key].nomCurso}</div></div>
              <div className="cuadro-borde col-xs-2" id={"fila3-" + key}><div className="margenes-padding">{this.state.cursosPlanEstudio[key].numciclo}</div></div>
              <div className="cuadro-borde col-xs-2" id={"fila4-" + key}><div className="margenes-padding">{this.state.cursosPlanEstudio[key].numcreditaje}</div></div>
              <div className="cuadro-borde col-xs-2" id={"fila5-" + key}><div className="margenes-padding">{this.state.cursosPlanEstudio[key].tipocurso}</div></div>
            </div>
          </div>
        )) : (
          <div className="alcentro ">
            <div className="col-xs-12 row">
              <div className="cuadro-borde col-xs-9">Sin datos de alumnos</div>
            </div>
          </div>
        ))
  }

  render () {

    return (
      <div>
        <h3>DEMANDA LABORAL
                <ul id="nav-mobile" className=" row right  hide-on-med-and-down">
            <li ><a className="seleccionar col" onClick={this.Regresar} >Regresar<i className="material-icons right">reply</i></a></li>
          </ul>
        </h3>
        <div className="SplitPane">
          <br />
          <div className="row">

            <div className="row col-xs-12">
              <label className="col-xs-2">Tipo de Programa</label>
              <Select className="col-xs-2"
                placeholder="Seleccione un tipo"
                name="selectipo"
                id="selectipo"
                value={this.state.tipo_actual}
                onChange={this.handleChangeSelectTipo}
                options={this.state.tipo_programa}
              />

              <label className="col-xs-1">Programa</label>
              <Select className="col-xs-6"
                placeholder="Seleccione una opcion"
                name="selecprograma"
                id="selecprograma"
                value={this.state.programa_actual}
                onChange={this.handleChangeSelectPrograma}
                options={this.state.programas}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="row col-xs-12">
              <label className="col-xs-2">Curriculo</label>
              <Select className="col-xs-7"
                placeholder="Seleccione un curriculo"
                name="seleccurriculo"
                id="seleccurriculo"
                value={this.state.tipocurriculoInput}
                onChange={this.handleChangeSelectCurriculo}
                options={this.state.optionsCurriculos}
              />
            </div>
          </div>

          <br />

          <hr />
          <h4 className="ml-3 subtitulo">Perfil de Egreso</h4>

          <div className="margenes-cuadro" >
            <div id="egreso">
              <div className="alcentro ">
                <div className="col-xs-12 row">
                  <div className="verdeagua cuadro-borde col-xs-1"><b>ID</b></div>
                  <div className="verdeagua cuadro-borde col-xs-1"><b>ESTADO</b></div>
                  <div className="verdeagua cuadro-borde col-xs-2"><b>CURRICULO_ID</b></div>
                  <div className="verdeagua cuadro-borde col-xs-3"><b>DESCRIPCIÓN</b></div>
                  <div className="verdeagua cuadro-borde col-xs-2"><b>N_ORDEN</b></div>
                </div>
              </div>
              {this.recorrerPerfilEgreso()}

            </div>
          </div >
          <br />
          <div className="row">

            <div className="row col-xs-12">
              <label className="col-xs-2">Naturaleza</label>
              <Select className="col-xs-2"
                placeholder="Seleccionar naturaleza"
                name="naturaleza"
                id="naturaleza"
                value={this.state.semestreInput1}
                onChange={this.handleChangeSelectSemestre1}
                options={this.state.optionsNaturaleza}
                disabled={this.state.vacio}
              />
              <label className="col-xs-2">Area</label>
              <Select className="col-xs-2"
                placeholder="Seleccionar area"
                name="segundoperiodo"
                id="segundoperiodo"
                value={this.state.semestreInput2}
                onChange={this.handleChangeSelectSemestre2}
                options={this.state.optionsSemestreSegundo}
                disabled={this.state.vacio}
              />
              <button onClick={this.seleccionar} className=" waves-light btn-small">Filtrar</button>
            </div>
          </div>
          <br />
          <h4 className="ml-3 subtitulo">Plan de Estudio</h4>

          <div className="margenes-cuadro" >
            <div id="plan">
              <div className="alcentro ">
                <div className="col-xs-12 row">
                  <div className="verdeagua cuadro-borde col-xs-2"><b>CÓDIGO</b></div>
                  <div className="verdeagua cuadro-borde col-xs-4"><b>CURSO</b></div>
                  <div className="verdeagua cuadro-borde col-xs-2"><b>CICLO</b></div>
                  <div className="verdeagua cuadro-borde col-xs-2"><b>CREDITOS</b></div>
                  <div className="verdeagua cuadro-borde col-xs-2"><b>TIPO</b></div>
                </div>
              </div>

              {this.recorrerPlanEstudio()}
            </div>
          </div >

        </div>
        <footer>
          <div className="row center-xs centrar color">
            Proyecto SIGAP © 2019 v.1.3
            </div>
        </footer>
      </div>)
  }

}

export default DemandaLaboral;