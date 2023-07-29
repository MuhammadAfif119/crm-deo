import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

const ExportExcel = ({ excelData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets : { 'data' : ws}, SheetNames : ['data']};
        const excelBuffer = XLSX.write(wb, { bookType : 'xlsx', type : 'array' });
        const data = new Blob([excelBuffer], { type : fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <>
            <Tooltip title='Excel Export'>
                <Button size='sm' my={2} variant='solid' colorScheme='blue' onClick={()=>exportToExcel(fileName)} cursor='pointer'>Export to Excel</Button>
            </Tooltip>
        </>
    )
}

export default ExportExcel;