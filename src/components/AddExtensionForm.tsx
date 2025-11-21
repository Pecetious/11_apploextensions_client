// AddExtensionForm.tsx
import { useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { addExtensionsSchema } from "../validations"; // Yup schema
import { useDropzone } from "react-dropzone";

interface AddExtensionFormProps {}

interface UploadedPaths {
  image1?: string;
  image2?: string;
  image3?: string;
  imageCategory?: string;
}

const AddExtensionForm: React.FC<AddExtensionFormProps> = () => {
  const [uploadedPaths, setUploadedPaths] = useState<UploadedPaths>({});
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      link: "",
      features: {
        backgroundChange: true,
        randomBackground: true,
        customFeatures: [],
      },
      images: {
        image1: null as File | null,
        image2: null as File | null,
        image3: null as File | null,
        imageCategory: null as File | null,
      },
    },
    validationSchema: addExtensionsSchema,
    onSubmit: async (values) => {
      if (!uploadedPaths.image1) {
        alert("Lütfen önce resimleri yükleyin!");
        return;
      }

      const payload = {
        name: values.name,
        category: values.category,
        link: values.link,
        features: values.features,
        images: uploadedPaths,
      };

      const res = await fetch("http://localhost:3001/api/extensions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
      alert("Extension eklendi!");
      formik.resetForm();
      setUploadedPaths({});
    },
  });

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    Object.entries(formik.values.images).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    const res = await fetch("http://localhost:3001/api/extensions/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadedPaths(data.paths);
    setUploading(false);
    alert("Resimler yüklendi!");
  };

  const renderDropzone = (
    field: keyof typeof formik.values.images,
    label: string
  ) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => {
        formik.setFieldValue(`images.${field}`, acceptedFiles[0]);
      },
      multiple: false,
      accept: { "image/*": [] },
    });

    const preview = formik.values.images[field] ? (
      <img
        src={URL.createObjectURL(formik.values.images[field]!)}
        alt="preview"
        className="w-32 h-32 object-cover rounded border"
      />
    ) : null;

    return (
      <div className="flex flex-col items-center mb-4">
        <label className="font-semibold mb-1">{label}</label>
        <div
          {...getRootProps()}
          className="w-40 h-40 border-2 border-dashed rounded flex justify-center items-center cursor-pointer hover:bg-gray-100 transition"
        >
          <input {...getInputProps()} />
          {preview || <p>Resmi buraya sürükle veya tıkla</p>}
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-3xl mx-auto my-10 p-8 bg-gray-800/90 rounded-xl shadow-2xl text-white space-y-6"
    >
      <h2 className="text-3xl font-bold text-center mb-4">Add New Extension</h2>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter extension name"
        />
        {formik.errors.name && (
          <p className="text-red-400 mt-1">{formik.errors.name}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          name="category"
          onChange={formik.handleChange}
          value={formik.values.category}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category"
        />
        {formik.errors.category && (
          <p className="text-red-400 mt-1">{formik.errors.category}</p>
        )}
      </div>

      {/* Link */}
      <div>
        <label className="block mb-1 font-medium">Link</label>
        <input
          type="text"
          name="link"
          onChange={formik.handleChange}
          value={formik.values.link}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional download link"
        />
      </div>

      {/* Features */}
      <fieldset className="mb-4 p-4 bg-gray-700/50 rounded-lg">
        <legend className="font-semibold mb-2">Features</legend>
        <div className="flex flex-wrap gap-4 items-center mb-3">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="features.backgroundChange"
              checked={formik.values.features.backgroundChange}
              onChange={formik.handleChange}
              className="w-5 h-5 accent-blue-500"
            />
            <span>Background Change</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="features.randomBackground"
              checked={formik.values.features.randomBackground}
              onChange={formik.handleChange}
              className="w-5 h-5 accent-blue-500"
            />
            <span>Random Background</span>
          </label>
        </div>

        <FormikProvider value={formik}>
          <div className="mt-2">
            <label className="block mb-2 font-semibold">Custom Features</label>
            <FieldArray name="features.customFeatures">
              {(arrayHelpers) => {
                const customFeatures =
                  formik.values.features?.customFeatures || [];
                return (
                  <div className="flex flex-col gap-3">
                    {customFeatures.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        No custom features yet. Click "Add Feature" to create
                        one.
                      </p>
                    )}

                    {customFeatures.map((feat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          name={`features.customFeatures.${index}`}
                          value={feat}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `features.customFeatures.${index}`,
                              e.target.value
                            )
                          }
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        className="mt-1 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>
                );
              }}
            </FieldArray>
          </div>
        </FormikProvider>
      </fieldset>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
        {renderDropzone("image1", "Image 1")}
        {renderDropzone("image2", "Image 2")}
        {renderDropzone("image3", "Image 3")}
        {renderDropzone("imageCategory", "Category Image")}
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          Submit Extension
        </button>
      </div>
    </form>
  );
};

export default AddExtensionForm;
