// multiple tables
@ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
@ViewChildren(MatSort) sort = new QueryList<MatSort>();

// set columns and page size options
columns: string[] = ["column"];
pageSizeOptions: number[] = [5,10,25,50,100];

// Initialize dataSource
dataSource: MatTableDataSource<IDataSource> = new MatTableDataSource([]);

// Add data and set sorting and paginatation
this.dataSource = new MatTableDataSource(data);
this.dataSource.sort = this.sort.toArray()[0];
this.dataSource.paginator = this.paginator.toArray()[0];