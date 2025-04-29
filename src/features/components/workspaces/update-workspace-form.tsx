"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
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

import {
  updateWorkspaceSchema,
  UpdateWorkspaceModel,
} from "@/features/schemas";
import { Workspace } from "@/features/types";
import {
  useDeleteWorkspace,
  useResetInviteCode,
  useUpdateWorkspace,
} from "@/features/actions/client";
import { toast } from "sonner";
import { useConfirm } from "@/hooks";

interface UpdateWorkspaceFormProps {
  onCancel?: () => void;
  underModal?: boolean;
  defaultValues: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancel,
  underModal,
  defaultValues,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();

  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      form.setValue("image", image instanceof File ? image : "");
    }
  };

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete Workspace",
    message: "This action cannot be undone.",
    variant: "destructive",
  });

  const [ResetDialog, confirmReset] = useConfirm({
    title: "Reset Invite Link",
    message: "This will invalidate the current invite link",
    variant: "destructive",
  });

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const handleDelete = async () => {
    if (!(await confirmDelete())) return;
    deleteWorkspace(
      { param: { workspaceId: defaultValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${defaultValues.$id}/join/${defaultValues.inviteCode}`;
  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard."));
  };

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();
  const handleResetInviteCode = async () => {
    if (!(await confirmReset())) return;
    resetInviteCode({ param: { workspaceId: defaultValues.$id } });
  };

  const form = useForm<UpdateWorkspaceModel>({
    defaultValues: {
      name: defaultValues.name ?? "",
      image: defaultValues.imageUrl,
    },
    resolver: zodResolver(updateWorkspaceSchema),
    mode: "onSubmit",
  });

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

  const onSubmit: SubmitHandler<UpdateWorkspaceModel> = ({ name, image }) => {
    updateWorkspace({
      form: { name, image },
      param: { workspaceId: defaultValues.$id },
    });
  };

  const Header = underModal ? DialogTitle : CardTitle;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${defaultValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <Header className="text-xl font-bold">{defaultValues.name}</Header>
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
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is a irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
