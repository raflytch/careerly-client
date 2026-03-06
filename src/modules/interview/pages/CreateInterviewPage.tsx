import { useState } from "react";
import { useCreateInterview } from "@/services/mutations/interview.mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, BrainCircuit, Loader2 } from "lucide-react";
import { Link } from "react-router";
import type { QuestionType } from "@/@types/interview";

export default function CreateInterviewPage() {
  const [jobPosition, setJobPosition] = useState("");
  const [questionType, setQuestionType] =
    useState<QuestionType>("multiple_choice");
  const [questionCount, setQuestionCount] = useState(5);

  const createMutation = useCreateInterview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobPosition.trim()) return;

    createMutation.mutate({
      job_position: jobPosition.trim(),
      question_type: questionType,
      question_count: questionCount,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/dashboard/interviews">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Mulai Latihan Interview
          </h2>
          <p className="text-muted-foreground">
            AI akan generate pertanyaan berdasarkan posisi yang kamu pilih
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="size-5" />
            Konfigurasi Interview
          </CardTitle>
          <CardDescription>
            Tentukan posisi, tipe, dan jumlah pertanyaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobPosition">Posisi Pekerjaan</Label>
              <Input
                id="jobPosition"
                placeholder="contoh: Backend Developer, Data Analyst"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionType">Tipe Pertanyaan</Label>
              <Select
                value={questionType}
                onValueChange={(v) => setQuestionType(v as QuestionType)}
                disabled={createMutation.isPending}
              >
                <SelectTrigger id="questionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Jumlah Pertanyaan</Label>
              <Select
                value={String(questionCount)}
                onValueChange={(v) => setQuestionCount(Number(v))}
                disabled={createMutation.isPending}
              >
                <SelectTrigger id="questionCount">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 pertanyaan</SelectItem>
                  <SelectItem value="5">5 pertanyaan</SelectItem>
                  <SelectItem value="10">10 pertanyaan</SelectItem>
                  <SelectItem value="15">15 pertanyaan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!jobPosition.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  AI sedang membuat pertanyaan...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 size-4" />
                  Mulai Interview
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
