import '@testing-library/jest-dom/extend-expect';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import { act } from '@testing-library/react';

const customGlobal: GlobalWithFetchMock = global as GlobalFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetcMock = customGlobal.fetch;
