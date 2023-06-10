"use client";

import { Loader2Icon, PlusSquareIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { addLink } from "~/server/actions";
import { useRouter } from "next/navigation";
import { env } from "~/env.mjs";

const formSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[a-z0-9]+$/i),
  url: z.string().url(),
});

const AddLink = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      url: "",
    },
  });

  function onSubmit(link: z.infer<typeof formSchema>) {
    startTransition(() => {
      addLink(link)
        .then(() => {
          form.reset();
          router.refresh();
          setOpen(false);
        })
        .catch(console.error);
    });
  }

  return (
    <div className="flex w-full justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusSquareIcon className="mr-1" size={18} />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new link</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="abcdef" {...field} />
                        </FormControl>
                        <FormDescription>
                          {env.NEXT_PUBLIC_WEBSITE_URL + "/"}
                          <span className="font-semibold">{field.value}</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://google.fr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Loader2Icon className="mr-1 animate-spin" size={18} />
                    ) : (
                      <PlusSquareIcon className="mr-1" size={18} />
                    )}{" "}
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddLink;
