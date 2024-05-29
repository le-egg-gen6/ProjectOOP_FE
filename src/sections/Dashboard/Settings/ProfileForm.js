import React, { useCallback, useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../../components/hook-form/FormProvider";
import { RHFTextField, RHFUploadAvatar } from "../../../components/hook-form";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserProfile } from "../../../redux/slices/app";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../../config";
import { Label } from "@mui/icons-material";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const { user } = useSelector((state) => state.app);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    about: Yup.string().required("About is required").nullable(true),
    country: Yup.string().required("Country is required").nullable(true),
    city: Yup.string().required("City is required").nullable(true),
    address: Yup.string().required("Address is required").nullable(true),
    avatar: Yup.string().required("Avatar is required").nullable(true),
  });

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    about: user?.about,
    country: user?.country,
    city: user?.city,
    address: user?.address,
    avatar: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      //   Send API request
      console.log("DATA", data);
      dispatch(
        UpdateUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          about: data.about,
          country: data.country,
          city: data.city,
          address: data.address,
          avatar: file,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("avatar", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />

        <Stack direction={"row"} spacing={4}>
          <RHFTextField
            name="firstName"
            label="First Name"
          />
          <RHFTextField
            name="lastName"
            label="Last Name"
          />
        </Stack>
        <RHFTextField multiline rows={4} name="about" label="About" />

        <Stack direction={"row"} spacing={4}>
          <RHFTextField
            name={"country"}
            label={"Country"}
          />
          <RHFTextField
            name={"city"}
            label={"City"}
          />
        </Stack>

        <RHFTextField multiline rows={2} name="address" label="Address" />


        <Stack direction={"row"} justifyContent="end">
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            // loading={isSubmitSuccessful || isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
