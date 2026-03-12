# Product Management App

Aplicación desarrollada en **Angular** que permite la gestión de productos financieros mediante operaciones CRUD.  
Este proyecto fue desarrollado como parte de una **prueba técnica**, aplicando buenas prácticas de arquitectura, reutilización de componentes y pruebas unitarias.

---

# Tecnologías utilizadas

- Angular
- TypeScript
- RxJS
- SCSS
- Jest
- HTML5
- Arquitectura basada en **Standalone Components**

---

# Funcionalidades implementadas

La aplicación permite gestionar productos financieros con las siguientes funcionalidades:

### Listado de productos

- Visualización en tabla responsive
- Búsqueda por nombre o descripción
- Selección de cantidad de registros visibles
- Acciones por producto (editar / eliminar)

### Creación de producto

Formulario con validaciones:

- ID obligatorio (3 - 10 caracteres)
- Nombre obligatorio (5 - 100 caracteres)
- Descripción obligatoria (10 - 200 caracteres)
- Logo obligatorio
- Fecha de liberación obligatoria
- Fecha de revisión automática (+1 año)

También incluye:

- Botón **Reiniciar**
- Botón **Cancelar**
- Validación de **ID duplicado**

---

### Edición de producto

- Precarga de datos del producto
- El campo **ID se deshabilita**
- Manejo de fechas compatible con formato ISO

---

### Eliminación de producto

Se implementó un **modal reutilizable de confirmación** para eliminar registros.

---

# Componentes reutilizables

## ModalComponent

Se desarrolló un **modal genérico reutilizable** que permite:

- Confirmaciones
- Alertas
- Manejo de errores

Configuración dinámica:

```ts
this.modalService.confirm({
  title: "Eliminar producto",
  message: "¿Desea eliminar este producto?",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
});
```
