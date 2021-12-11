// csv parser

// enum class CSVState {
//     UnquotedField,
//     QuotedField,
//     QuotedQuote
// };

// std::vector<std::string> readCSVRow(const std::string &row) {
//     CSVState state = CSVState::UnquotedField;
//     std::vector<std::string> fields {""};
//     size_t i = 0; // index of the current field
//     for (char c : row) {
//         switch (state) {
//             case CSVState::UnquotedField:
//                 switch (c) {
//                     case ',': // end of field
//                               fields.push_back(""); i++;
//                               break;
//                     case '"': state = CSVState::QuotedField;
//                               break;
//                     default:  fields[i].push_back(c);
//                               break; }
//                 break;
//             case CSVState::QuotedField:
//                 switch (c) {
//                     case '"': state = CSVState::QuotedQuote;
//                               break;
//                     default:  fields[i].push_back(c);
//                               break; }
//                 break;
//             case CSVState::QuotedQuote:
//                 switch (c) {
//                     case ',': // , after closing quote
//                               fields.push_back(""); i++;
//                               state = CSVState::UnquotedField;
//                               break;
//                     case '"': // "" -> "
//                               fields[i].push_back('"');
//                               state = CSVState::QuotedField;
//                               break;
//                     default:  // end of quote
//                               state = CSVState::UnquotedField;
//                               break; }
//                 break;
//         }
//     }
//     return fields;
// }

// /// Read CSV file, Excel dialect. Accept "quoted fields ""with quotes"""
// std::vector<std::vector<std::string>> readCSV(std::istream &in) {
//     std::vector<std::vector<std::string>> table;
//     std::string row;
//     while (!in.eof()) {
//         // std::cout << "row" << std::endl;
//         std::getline(in, row);
//         if (in.bad() || in.fail()) {
//             break;
//         }
//         auto fields = readCSVRow(row);
//         table.push_back(fields);
//     }
//     return table;
// }
        
// int res = access("data/stocks.txt", R_OK);
// if (res < 0) {
//     if (errno == ENOENT) {
//         // file does not exist
//         Console::Log(FAILURE, "File does not exist.");
//     } else if (errno == EACCES) {
//         Console::Log(SUCCESS, "File exists.");
//     } else {
//         // uh oh
//     }
// }

// std::ifstream file("data/stocks.txt");
// std::vector<std::vector<std::string>> rows = readCSV(file);
// std::cout << "===============ROWS=================" << std::endl;
// std::cout << rows.size() << std::endl;
// std::ofstream f("data/stocks.sql");
// for(auto row : rows) {
//     // std::cout << row.at(0) << std::endl;
//     if (row.at(1).find('\'') != std::string::npos) {
//         // row.at(1) = ""; // found
//         std::vector<std::string> output;

//         int size = row.at(1).size();

//         std::string::size_type prev_pos = 0, pos = 0;

//         while((pos = row.at(1).find("\'", pos)) != std::string::npos)
//         {
//             std::string substring( row.at(1).substr(prev_pos, pos-prev_pos) );

//             output.push_back(substring);

//             prev_pos = ++pos;
//         }

//         int size2 = row.at(1).size();

//         output.push_back(row.at(1).substr(prev_pos, pos-prev_pos)); // Last word
//         output.push_back(row.at(1).substr(0, size));

//         std::cout << output.at(0) << "'" << output.at(1) << " :: " << size << std::endl;
//         row.at(1) = output.at(0) + "''" + output.at(1);
//     }
//     // else
//     //     ;
//      // not found
//     f << "INSERT INTO stocks (ticker, name) VALUES('" << row.at(0);
//     f << "', '" << row.at(1) << "');" << std::endl;
// }
// f.close();
// std::cout << rows.size() << std::endl;