import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useState } from "react";

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordItem {
  word: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: Meaning[];
}

function App() {
  const [wordMeaning, setWordMeaning] = useState<string>("");
  const [searchWord, setSearchWord] = useState<string>("");

  const query = useQuery<WordItem[], Error>({
    queryKey: ["get-word-meaning", searchWord],
    queryFn: async function(): Promise<WordItem[]> {
      const response = await axios.get<WordItem[]>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
      );
      return response.data;
    },
    enabled: !!searchWord,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!wordMeaning) {
      alert("Enter a word");
      return;
    }
    setSearchWord(wordMeaning.trim());
  }

  if (query.isLoading) return <h1>Loading...</h1>;
  if (query.isError) return <h1>{query.error.message}</h1>;

  return (
    <div className=" container my-2 m-auto">
      <form onSubmit={handleSubmit}>
       <div className="my-2">
         <Input
          placeholder="Enter word"
          className="w-3/4 mr-2"
          value={wordMeaning}
          onChange={function(e: React.ChangeEvent<HTMLInputElement>): void {
            setWordMeaning(e.target.value);
          }}
        />
        <Button type="submit">Search</Button>
       </div>
      </form>
{searchWord}
      <div className={` border border-${searchWord}-500 bg-${searchWord}-500/20 rounded-lg p-4`}>
        {query.data &&
          query.data.map(function(item: WordItem, index: number) {
            var firstMeaning =
              item.meanings && item.meanings.length > 0
                ? item.meanings[0]
                : undefined;
            var firstDefinition =
              firstMeaning &&
              firstMeaning.definitions &&
              firstMeaning.definitions.length > 0
                ? firstMeaning.definitions[0].definition
                : "No definition found";
            return (
              <p key={index}>
                <strong>{item.word}:</strong> {firstDefinition}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default App;
