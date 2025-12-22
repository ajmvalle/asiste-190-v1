import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelect: (file: File | null) => void;
  preview?: string | null;
}

const DropzoneComponent = ({ onFileSelect, preview }: Props) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  return (
    <ComponentCard title="Foto del alumno">
      <div className="border border-dashed rounded-xl p-4">
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-48 object-cover rounded-lg border"
            />

            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-sm text-brand-500 underline"
            >
              Cambiar foto
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-xl border-dashed border p-7 lg:p-10
              ${
                isDragActive
                  ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              }
            `}
          >
            <input {...getInputProps()} />

            {/* UI original */}
            <div className="dz-message flex flex-col items-center">
              Arrastra la imagen aquí o haz clic
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
