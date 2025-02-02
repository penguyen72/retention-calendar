import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { useMediaQuery } from "usehooks-ts"
import { AddEventForm } from "./add-event-form"

interface Props {
  selectedDate: Date
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddGoalButton({ selectedDate, open, setOpen }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="ml-auto"
            type="button"
            onClick={() => setOpen(true)}
          >
            Add Goal
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <AddEventForm selectedDate={selectedDate} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="ml-auto" type="button" onClick={() => setOpen(true)}>
          Add Goal
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Goal</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <AddEventForm selectedDate={selectedDate} setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
