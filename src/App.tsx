import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./components/ui/input";
import { useState } from "react";
import { Button } from "./components/ui/button";


function App() {
  const [wordMeaning,setWordMeaning]=useState("");
  const [searchWord,setSearchWord]=useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-word-meaning", searchWord],
    queryFn: async function() {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
      );
      return response.data;
    },
    enabled: !!searchWord,
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!wordMeaning){
      alert("Enter a word");
      return;
    }
    setSearchWord(wordMeaning.trim());
  }

  if (isLoading) return <h1>Loading please wait...</h1>;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Enter word"
          value={wordMeaning}
          onChange={function(e){ setWordMeaning(e.target.value) }}
        />
        <Button type="submit">Search</Button>
      </form>
      <div>
        {data && data.map(function(item,index){
          var firstMeaning = item.meanings && item.meanings[0];
          var firstDefinition = firstMeaning && firstMeaning.definitions && firstMeaning.definitions[0]
            ? firstMeaning.definitions[0].definition
            : "No definition found";
          return <p key={index}><strong>{item.word}:</strong> {firstDefinition}</p>;
        })}
      </div>
    </>
  );
}

export default App;
