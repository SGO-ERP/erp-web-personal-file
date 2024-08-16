/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This class is used for set essay_id to candidate
 *
 * If candidate chooses from existing essay types then you can set id of essay
 * If candidate creates a new essay you can set name of the new essay
 */
export type CandidateEssayTypeSetToCandidate = {
    name?: string;
    nameKZ?: string;
    id?: string;
};
