import { useState, useRef } from 'react'
import '../assets/index.css'
import { Formik, ErrorMessage, Form } from 'formik'
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from 'react-hot-toast';



function App() {

  const [Valor, setValor] = useState()
  const captcha = useRef(null);

  const captChatHandle = () => {
    if(captcha.current.getValue()){
      console.log("El usuario no es un robot")
    }
  }

  function generarCURP(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, estado) {
    const primeraSilabaNombre = nombre.charAt(0);
    const primeraLetraApellidoPaterno = apellidoPaterno.charAt(0);
    const primeraVocalApellidoPaterno = apellidoPaterno.match(/[aeiou]/i);
    const primerasSilabasApellidoPaterno = primeraLetraApellidoPaterno + (primeraVocalApellidoPaterno || '');
    const primeraSilabaApellidoMaterno = apellidoMaterno.charAt(0);
    const anioNacimiento = fechaNacimiento.slice(2, 4);
    const mesNacimiento = fechaNacimiento.slice(5, 7);
    const diaNacimiento = fechaNacimiento.slice(8, 10);
    const primeraSilabaSexo = sexo.charAt(0);
  
    const consonantesInternas = {
      apellidoPaterno: apellidoPaterno.replace(/^[^aeiou]+|[aeiou]|[^aeiou]+$/gi, '').charAt(0) || '',
      apellidoMaterno: apellidoMaterno.replace(/^[^aeiou]+|[aeiou]|[^aeiou]+$/gi, '').charAt(0) || '',
      nombre: nombre.replace(/^[^aeiou]+|[aeiou]|[^aeiou]+$/gi, '').charAt(0) || '',
    };
  
    const curp = `${primerasSilabasApellidoPaterno}${primeraSilabaApellidoMaterno}${primeraSilabaNombre}${anioNacimiento}${mesNacimiento}${diaNacimiento}${primeraSilabaSexo}CS${consonantesInternas.apellidoPaterno}${consonantesInternas.apellidoMaterno}${consonantesInternas.nombre}`;
  
    return curp.toUpperCase();
  }



  return (
    <>
      <div className='flex justify-center items-center w-full h-screen gap-10 flex-col'>
      <div className='flex justify-center items-center'>
          <h1 className='text-4xl text-gray-900 tracking-tight font-extrabold leading-none '> CURP <span class="text-blue-600 dark:text-blue-500">Generator</span></h1>
      </div>
        <Formik
          initialValues={{
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            fechaNacimiento: "",
            sexo: "",
            estado: "Chiapas"
          }}
          onSubmit={async (values, actions) => {
            try {
              if (captcha.current.getValue()) {
                const fechaNac = new Date(values.fechaNacimiento);
                const validYear = new Date('1900-01-01'); // Cambiado a 1901
                if (fechaNac.getTime() >= validYear.getTime()) {
                  console.log('Fecha de nacimiento válida.');
                  const curp = generarCURP(values.nombre, values.apellidoPaterno, values.apellidoMaterno, values.fechaNacimiento, values.sexo, values.estado);
                  toast.success('Campos validos!');
                  setValor(curp);
                } else {
                  console.log(values.fechaNacimiento);
                  toast.error("El Año tiene que ser mayor del 1900.");
                  console.log('La fecha de nacimiento debe ser a partir del año 1901.'); // Cambiado a 1901
                }
              }
            } catch (e) {
              console.log(e);
            }

            
            /* toast.success('RFC Valido') */

          }}

        >{({ values, errors, touched, setFieldValue, handleSubmit, handleChange, isSubmitting }) => (
          <Form className='space-y-5'>
            <div class="relative z-0 w-full mb-5 group">  
              <input onChange={handleChange} type="text" name="nombre" id="nombre" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="nombre" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
              <ErrorMessage name="nombre" className='text-red-500' component="div" />
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <input onChange={handleChange} type="text" name="apellidoPaterno" id="apellidoPaterno" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="apellidoPaterno" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Apellido paterno</label>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input onChange={handleChange} type="text" name="apellidoMaterno" id="apellidoMaterno" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="apellidoMaterno" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Apellido materno</label>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input onChange={handleChange} type="date" name="fechaNacimiento" id="fechaNacimiento" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="fechaNacimiento" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de nacimiento</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                onChange={handleChange}
                name="sexo"
                id="sexo"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              >
                <option value="" >Selecciona una opción</option>
                <option value="Hombre">Masculino</option>
                <option value="Mujer">Femenino</option>
              </select>
              <label
                htmlFor="sexo"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Sexo
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="repeat_password" id="floating_repeat_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={values.estado} required />
              <label for="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Estado</label>
            </div>
            <ReCAPTCHA 
                  ref={captcha}
                  sitekey="6LcoNJUpAAAAAN03ctj2XWw6vZ9iaFII3w5bKKF7" onChange={captChatHandle}
            />
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Validar</button>
          </Form>
        )}
        </Formik>
        <div className='flex justify-center items-center'>
          <Toaster />
          <h1 className='text-2xl text-gray-900 '> La curp es: {Valor}</h1>
        </div>
      </div>
    </>
  )
}

export default App
