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