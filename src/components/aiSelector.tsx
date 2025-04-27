import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AI_OPTIONS = [
    { value: "deepseek", label: "DeepSeek AI" },
    { value: "openai", label: "OpenAI" },
]

type AiSelectorProps = {
    selectedAi: string,
    setSelectedAi: React.Dispatch<React.SetStateAction<string>>,
}

export default function AiSelector({
    selectedAi,
    setSelectedAi,
}: AiSelectorProps) {

return (
    <Card>
        <CardHeader>
            <CardTitle>Select AI Model</CardTitle>
        </CardHeader>
        <CardContent>
            <Select value={selectedAi} onValueChange={setSelectedAi}>
            <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an AI model" />
            </SelectTrigger>
            <SelectContent>
                {AI_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </CardContent>
    </Card>
    )
}
