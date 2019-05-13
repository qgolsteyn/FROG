// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { SearchField, Highlight } from 'frog-utils';
import { orderBy } from 'lodash';

export const PagesLinks = ({
  pages,
  currentPage,
  search = '',
  index,
  onSelect
}: {
  pages: Object[],
  currentPage?: string,
  search: string,
  index: ?number,
  onSelect: Function
}) =>
  pages.map((pageObj, i) => {
    const pageId = pageObj.id;
    const pageTitle = pageObj.title;

    const currentPageBool = pageId === currentPage;

    const style = currentPageBool
      ? {
          color: 'blue',
          cursor: 'pointer'
        }
      : {
          cursor: 'pointer'
        };
    return (
      <li
        key={pageId}
        style={{
          fontSize: '14px',
          backgroundColor: i === index ? 'cornflowerblue' : undefined
        }}
      >
        <span
          onClick={e => {
            onSelect(pageTitle);
            e.preventDefault();
          }}
          style={style}
        >
          <Highlight searchStr={search} text={pageTitle} />
        </span>
      </li>
    );
  });

export default ({ onSearch, setModalOpen, pages, onSelect }: Object) => {
  const [search, setSearch] = React.useState('');
  return (
    <Dialog open onClose={() => setModalOpen(false)}>
      <DialogTitle>Find page</DialogTitle>
      <DialogContent>
        <div
          style={{
            width: '600px',
            height: '600px',
            overflow: 'auto',
            paddingRight: '100px'
          }}
        >
          <SearchAndFind
            pages={pages}
            focus
            setSearch={setSearch}
            onSearch={onSearch}
            onSelect={onSelect}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        {search !== '' && (
          <Button color="secondary" onClick={() => onSearch(search)}>
            SEARCH
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export const SearchAndFind = ({
  setSearch: upstreamSetSearch,
  pages,
  onSearch,
  onSelect,
  focus
}: Object) => {
  const [search, setSearch] = React.useState('');
  const [index, setIndex] = React.useState(null);
  const filteredPages = orderBy(pages, 'title').filter(x =>
    x.title.toLowerCase().includes(search)
  );
  return (
    <>
      <SearchField
        prompt="Select page or do a fulltext search"
        debounce={100}
        focus={!!focus}
        onKeyDown={e => {
          if (e.keyCode === 38 && index && index > 0) {
            e.preventDefault();
            setIndex(index - 1);
          }
          if (
            e.keyCode === 40 &&
            (index === null || index < filteredPages.length - 1)
          ) {
            e.preventDefault();
            setIndex((index === null ? -1 : index) + 1);
          }
          if (e.keyCode === 13) {
            e.preventDefault();
            index === null || !filteredPages[index]?.title
              ? onSearch(search)
              : onSelect(filteredPages[index].title);
          }
        }}
        onChange={e => {
          setIndex(null);
          setSearch(e.toLowerCase());
          if (upstreamSetSearch) {
            upstreamSetSearch(e.toLowerCase());
          }
        }}
        onSubmit={() =>
          index === null || !filteredPages[index]?.title
            ? onSearch(search)
            : onSelect(filteredPages[index].title)
        }
      />
      <PagesLinks
        onSelect={onSelect}
        index={index}
        search={search}
        pages={filteredPages}
      />
    </>
  );
};
