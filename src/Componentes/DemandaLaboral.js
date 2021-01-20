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
      optionsTipoPrograma: [{ value: "03", label: "Maestria" }, { value: "05", label: "Doctorado" }, { value: "06", label: "Diplomatura" }],
      optionsPrograma: [],
      optionsCurriculo: [],
      optionsNaturaleza: [],
      optionsArea: [],
      programasBD: [],
      tipo_actual: { value: "-1", label: "Seleccione un tipo" },
      programa_actual: { value: "-1", label: "Seleccione un programa" },
      curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
      naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
      area_actual: { value: "-1", label: "Seleccione area" },
      vacio: false,
      arregloAlumnos: [],
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

    this.obtenerAreas();
    this.obtenerNaturalezas();
  }



  handleChangeSelectTipo = (estado) => {
    if (estado == null) {
      this.setState({
        tipo_actual: { value: "-1", label: "Seleccione un tipo" },
        optionsCurriculo: [],
        programa_actual: { value: "-1", label: "Seleccione un programa" },
        curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
        naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
        area_actual: { value: "-1", label: "Seleccione area" },
        perfilEgreso: [],
        cursosPlanEstudio: [],
      });
      return;
    }


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
          optionsPrograma: arreglo/**/
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
          optionsPrograma: arreglo/**/
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
          optionsPrograma: arreglo/**/
        })
      ))
        ; break;
    }

    this.setState({
      optionsCurriculo: [],
      programa_actual: { value: "-1", label: "Seleccione un programa" },
      curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
      naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
      area_actual: { value: "-1", label: "Seleccione area" },
      perfilEgreso: [],
      cursosPlanEstudio: [],
    });
  }

  handleChangeSelectPrograma = (estado) => {
    if (estado == null) {
      this.setState({
        programa_actual: { value: "-1", label: "Seleccione un programa" },
        optionsCurriculo: [],
        curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
        naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
        area_actual: { value: "-1", label: "Seleccione area" },
        perfilEgreso: [],
        cursosPlanEstudio: [],
      });
      return;
    }

    this.setState({
      optionsCurriculo: [],
      curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
      naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
      area_actual: { value: "-1", label: "Seleccione area" },
      perfilEgreso: [],
      cursosPlanEstudio: [],
    });

    this.setState({
      programa_actual: { value: estado.value, label: estado.label }
    });
    setTimeout(() => {
      this.obtenerCurriculos();
    }, 100);

  }

  handleChangeSelectCurriculo = (estado) => {
    if (estado == null) {
      this.setState({
        curriculo_actual: { value: "-1", label: "Seleccione un curriculo" },
      });
      return;
    }
    this.setState({
      curriculo_actual: { value: estado.value, label: estado.label }
    });
    setTimeout(() => {
      this.obtenerPerfilEgreso();
      this.obtenerPlanEstudio();
    }, 100);
  }

  handleChangeSelectNaturaleza = (estado) => {
    if (estado == null) {
      this.setState({
        naturaleza_actual: { value: "-1", label: "Seleccione naturaleza" },
      });
      return;
    }
    this.setState({
      naturaleza_actual: { value: estado.value, label: estado.label }
    });
  }

  handleChangeSelectArea = (estado) => {
    if (estado == null) {
      this.setState({
        area_actual: { value: "-1", label: "Seleccione area" },
      });
      return;
    }
    this.setState({
      area_actual: { value: estado.value, label: estado.label }
    });
  }

  Regresar = (e) => {
    browserHistory.push('/vista/loginFormAdmi');
    e.preventDefault();
  }

  obtenerAreas = () => {
    fetch(CONFIG + 'area/listar')
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        var optionsArea = [];
        resultado.forEach(element => {
          optionsArea = [...optionsArea, { value: element.area_id, label: element.area_desc }]
        });
        this.setState({
          areas: resultado,
          optionsArea
        })

        console.log(this.state.optionsArea)
      })
  }

  obtenerNaturalezas = () => {
    fetch(CONFIG + 'naturaleza/listar')
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        var optionsNaturaleza = [];
        resultado.forEach(element => {
          optionsNaturaleza = [...optionsNaturaleza, { value: element.naturaleza_id, label: element.naturaleza_desc }]
        });
        this.setState({
          naturalezas: resultado,
          optionsNaturaleza
        })

        console.log(this.state.optionsNaturaleza)
      })
  }

  obtenerCurriculos = () => {
    fetch(CONFIG + 'alumno/alumnoprograma/programa/curriculo/' + this.state.programa_actual.value)
      .then((response) => {
        return response.json();
      })
      .then((resultado) => {
        var optionsCurriculo = [];
        resultado.forEach(element => {
          optionsCurriculo = [...optionsCurriculo, { value: element.curriculo_id, label: element.curriculo_desc }]
        });
        this.setState({
          curriculos: resultado,
          optionsCurriculo: optionsCurriculo
        })

        console.log(this.state.optionsCurriculo)
      })
  }

  obtenerPerfilEgreso = () => {
    fetch(CONFIG + 'alumno/alumnoprograma/programa/perfilEgreso/' + this.state.curriculo_actual.value)
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
    fetch(CONFIG + 'curso/programa/' + this.state.programa_actual.value + '/planestudio/' + this.state.curriculo_actual.label.slice(1))
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
              <div className="cuadro-borde col-xs-9">Sin datos del perfil de egreso</div>
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
              <div className="cuadro-borde col-xs-12">Sin datos del plan de estudio</div>
            </div>
          </div>
        ))
  }

  render () {

    return (
      <div>
        <h3> Módulo Demanda Laboral
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
                options={this.state.optionsTipoPrograma}
              />

              <label className="col-xs-1">Programa</label>
              <Select className="col-xs-6"
                placeholder="Seleccione una opcion"
                name="selecprograma"
                id="selecprograma"
                value={this.state.programa_actual}
                onChange={this.handleChangeSelectPrograma}
                options={this.state.optionsPrograma}
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
                value={this.state.curriculo_actual}
                onChange={this.handleChangeSelectCurriculo}
                options={this.state.optionsCurriculo}
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
                value={this.state.naturaleza_actual}
                onChange={this.handleChangeSelectNaturaleza}
                options={this.state.optionsNaturaleza}
                disabled={this.state.vacio}
              />
              <label className="col-xs-2">Area</label>
              <Select className="col-xs-2"
                placeholder="Seleccionar area"
                name="area"
                id="area"
                value={this.state.area_actual}
                onChange={this.handleChangeSelectArea}
                options={this.state.optionsArea}
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