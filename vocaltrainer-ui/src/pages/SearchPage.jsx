import { Button, Grid } from "@mui/material";
import _ from "lodash";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import ExerciseCard from "../components/Cards/ExerciseCard";
import ProfileCard from "../components/Cards/ProfileCard";
import Searcher from "../components/Searcher/Searcher";
import { FetchContext } from "../contexts/FetchContext";
import { SearchContext } from "../contexts/SearchContext";

/**
 * Search page
 */
const SearchPage = () => {
    const fetchContext = useContext(FetchContext);
    const searchContext = useContext(SearchContext);
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState();
    const { handleSubmit } = useForm();

    /**
     * Searches for the results matching the filters
     */
    const onSubmit = () => {
        const mergeResults = (newResults) => _.intersectionWith(...newResults, _.isEqual);
        const fetchResultsFilter = async (api) => {
            try {
                const { data } = await fetchContext.authAxios.get(api);
                return data;
            } catch {

            }
        }
        const { filters } = searchContext;

        Promise.all(
            Object.values(filters)
                .filter(filter => filter !== null)
                .map(async (api) => fetchResultsFilter(api))
        ).then(data => {
            setResults(mergeResults(data))
        });
    }

    return (
        <Grid container marginTop={2}>
            <Grid
                container
                item
                xs={4}
                padding={2}
                height="100%"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid item
                    >
                        <Searcher setSearchTerm={setSearchTerm} />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" type="submit">Search</Button>
                    </Grid>
                </form>
            </Grid>
            <Grid
                container
                item
                xs={8}
                gap={3}
                >
                {results?.map(result => {
                    return result.type ?
                        <ExerciseCard key={result.publicationId} data={result} xs={2} short={true}/> 
                        : <ProfileCard key={result.userId} data={result} />
                })
                }
            </Grid>
        </Grid>
    )
}

export default SearchPage;