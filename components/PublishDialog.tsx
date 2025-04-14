import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  post: string;
  onPublish: (channel: string, time?: string) => void;
  channels: string[];
}

export function PublishDialog({ open, onClose, post, onPublish, channels }: PublishDialogProps) {
  const [step, setStep] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [publishTime, setPublishTime] = useState('');

  const handleNext = () => {
    if (step === 0 && selectedChannel) {
      setStep(1);
    } else if (step === 1) {
      onPublish(selectedChannel, publishTime);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 0 ? 'Выберите канал' : 'Настройки публикации'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">{post}</p>
              <Select onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите канал" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map(channel => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <p className="text-sm mb-2">Канал: <span className="font-medium">{selectedChannel}</span></p>
              <p className="text-sm text-gray-500 mb-4">Когда опубликовать?</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPublishTime('now');
                    handleNext();
                  }}
                >
                  Сейчас
                </Button>
                <div className="relative flex-1">
                  <Input
                    type="time"
                    onChange={(e) => setPublishTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {step === 1 && (
              <Button variant="outline" onClick={() => setStep(0)}>
                Назад
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={step === 0 && !selectedChannel}
            >
              {step === 0 ? 'Далее' : 'Опубликовать'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
