"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  DottedSeparator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Avatar,
  AvatarFallback,
  DialogTitle,
} from "@/components";
import { cn } from "@/lib/utils";

import { useCreateWorkspace } from "@/features/actions/client";
import {
  CreateWorkspaceModel,
  createWorkspaceSchema,
} from "@/features/schemas";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
  underModal?: boolean;
}

export const CreateWorkspaceForm = ({
  onCancel,
  underModal,
}: CreateWorkspaceFormProps) => {
  const router = useRouter();

  const imageRef = useRef<HTMLInputElement>(null);

  // TODO: After successful creation and form reset, `upload image` doesn't work
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      form.setValue("image", image instanceof File ? image : "");
    }
  };

  const form = useForm<CreateWorkspaceModel>({
    defaultValues: { name: "" },
    resolver: zodResolver(createWorkspaceSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<CreateWorkspaceModel> = ({ name, image }) => {
    createWorkspace(
      { form: { name, image } },
      {
        onSuccess: ({ data: { $id } }) => {
          form.reset();
          router.push(`/workspaces/${$id}`);
        },
      }
    );
  };

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const Header = underModal ? DialogTitle : CardTitle;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <Header className="text-xl font-bold">Create a new workspace</Header>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter workspace name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          className="hidden"
                          accept=".jpg, .png, .jpeg, .svg"
                          type="file"
                          ref={imageRef}
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                        {field.value ? (
                          <Button
                            variant="destructive"
                            type="button"
                            disabled={isPending}
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange(null);
                              if (imageRef.current) {
                                imageRef.current.value = "";
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            variant="tertiary"
                            type="button"
                            disabled={isPending}
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => imageRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
