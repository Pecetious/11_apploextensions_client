import * as yup from "yup";

const featuresSchema = yup.object().shape({
  backgroundChange: yup.boolean().optional(),
  randomBackground: yup.boolean().optional(),
  customFeatures: yup.array().of(yup.string()).optional(),
});

export const addExtensionsSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(255, "Max 255 characters"),
  category: yup
    .string()
    .required("Category is required")
    .max(100, "Max 100 characters"),
  link: yup.string().url("Must be a valid URL").optional(),
  features: featuresSchema.optional(),
  images: yup.object({
    image1: yup.mixed().required("Image 1 is required"),
    image2: yup.mixed().required("Image 2 is required"),
    image3: yup.mixed().required("Image 3 is required"),
    imageCategory: yup.string().required("Category image is required"),
  }),
});
