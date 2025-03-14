import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DataType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays } from "date-fns"
import { Minus, Plus, X } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useLocalStorage, useMediaQuery } from "usehooks-ts"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Title is required!"
  }),
  repeatInterval: z
    .array(z.object({ value: z.number() }))
    .nonempty({ message: "Array cannot be empty" })
    .refine(
      (arr) => arr.every((obj, i) => i === 0 || obj.value > arr[i - 1].value),
      {
        message: "Array must be strictly increasing"
      }
    )
})

interface Props {
  selectedDate: Date
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddEventForm({ selectedDate, setOpen }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [database, setDatabase] = useLocalStorage<DataType[]>(
    "retention-calender",
    []
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      repeatInterval: [{ value: 1 }]
    }
  })

  const { control, setValue, getValues, reset } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "repeatInterval"
  })

  function onClose() {
    setOpen(false)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setDatabase((prevValue) => {
      const groupId = uuidv4()
      let totalDays = 0
      prevValue.push({
        id: uuidv4(),
        groupId: groupId,
        name: values.name,
        date: selectedDate,
        completed: false
      })
      values.repeatInterval.forEach((item) => {
        totalDays += item.value
        prevValue.push({
          id: uuidv4(),
          groupId: groupId,
          name: values.name,
          date: addDays(selectedDate, totalDays),
          completed: false
        })
      })
      return prevValue
    })
    reset()
    onClose()
  }

  function subtractRepeat(index: number) {
    const repeatInterval = getValues("repeatInterval")
    if (!repeatInterval[index]) return

    const currentValue = repeatInterval[index].value

    if (index === 0) {
      setValue(`repeatInterval.${index}.value`, Math.max(currentValue - 1, 1))
    } else {
      const prevValue = repeatInterval[index - 1].value
      setValue(
        `repeatInterval.${index}.value`,
        Math.max(currentValue - 1, prevValue + 1)
      )
    }
  }

  function addRepeat(index: number) {
    const repeatInterval = getValues("repeatInterval")
    if (!repeatInterval[index]) return
    const currentValue = repeatInterval[index].value
    if (index === repeatInterval.length - 1) {
      setValue(`repeatInterval.${index}.value`, currentValue + 1)
    } else {
      const nextValue = repeatInterval[index + 1].value
      setValue(
        `repeatInterval.${index}.value`,
        Math.min(currentValue + 1, nextValue - 1)
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="Input Goal Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full gap-2">
          {fields.map((_, index) => {
            return (
              <div key={index} className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <X />
                  </Button>
                  <p className="text-center align-middle">Repeat {index + 1}</p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => subtractRepeat(index)}
                  >
                    <Minus />
                  </Button>
                  <Controller
                    control={control}
                    name={`repeatInterval.${index}.value`}
                    render={({ field: { value } }) => {
                      return (
                        <p className="text-center align-middle w-9">{value}</p>
                      )
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => addRepeat(index)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            )
          })}
          <Button
            className="mx-auto"
            variant="ghost"
            type="button"
            onClick={() =>
              append({
                value: fields[fields.length - 1].value + 1
              })
            }
          >
            <Plus />
            Add Interval
          </Button>
        </div>
        <Button className={cn(!isDesktop && "w-full")} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
