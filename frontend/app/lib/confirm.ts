import Swal from "sweetalert2";

export function confirmDelete(
  message = "¿Seguro que deseas eliminar este registro?"
) {
  return Swal.fire({
    title: "Confirmar eliminación",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ef4444", // rojo tailwind
    reverseButtons: true,
  });
}
